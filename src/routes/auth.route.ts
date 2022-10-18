import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "../entities/User.entity";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const userRepo = AppDataSource.manager.getRepository(User);
const mapErrors = (errors: Object[]) => {
  return {
    errors: errors.reduce((prev, err: any) => {
      prev[err.property] = Object.entries(err.constraints)[0][1];
      return prev;
    }, {}),
  };
};

const register = async (req: Request, res: Response) => {
  const { email, username, password, area, rol } = req.body;
  const asignaRol = res.locals.user?.rol === "admin";
  try {
    //Validate data
    let errores: any = {};
    const emailUser = await userRepo.findOneBy({ email: email });
    const usernameUser = await userRepo.findOneBy({ username: username });
    const usuarioCreacion = res.locals.user?.usuario || "API";
    if (emailUser) errores.email = "Este correo ya se encuentra registrado";
    if (usernameUser)
      errores.username = "Este usuario ya se encuentra registrado";
    if (Object.keys(errores).length > 0)
      return res.status(400).json({ errors: errores });

    //Create user
    const user = new User({ username, email, password, usuarioCreacion, area });
    if (asignaRol) user.rol = rol;
    errores = await validate(user);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }

    await userRepo.save(user);

    // Return user
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Usuario no puede estar vacio";
    if (isEmpty(password)) errors.password = "Contraseña no puede estar vacia";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = await userRepo.findOneBy({ username: username });
    if (!user) return res.status(404).json({ username: "Usuario no existe" });
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ password: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    );
    return res.json({ user });
  } catch (error) {
    return res.json({ message: "Algo salio mal " + error });
  }
};

const me = (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

const logout = (req: Request, res: Response) => {
  res.set(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );
  return res.json(200).json({ success: true });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", user, auth, logout);
export default router;
