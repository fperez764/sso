import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User, { Areas, Roles } from "../entities/User.entity";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import { mapErrors } from "../utils/misc";
import logger from "../utils/logger";
import Permiso from "../entities/Permiso.entity";

const userRepo = AppDataSource.manager.getRepository(User);

const register = async (req: Request, res: Response) => {
  const { email, password, area } = req.body;
  try {
    const esAbe = "@abe.bo";
    //Validate data
    let errores: any = {};
    const username = email.replace(esAbe, "");
    const emailUser = await userRepo.findOneBy({ email: email });
    //TODO* Verificar si correo existe con LDAP
    const usernameUser = await userRepo.findOneBy({ username: username });
    const usuarioCreacion = "API";
    if (emailUser) errores.email = "Este correo ya se encuentra registrado";
    if (!email.includes(esAbe)) errores.email = "El correo debe ser de la ABE";
    if (usernameUser)
      errores.username = "Este usuario ya se encuentra registrado";
    if (Object.keys(errores).length > 0)
      return res.status(400).json({ errors: errores });

    //Create user
    const user = new User({
      username,
      email,
      password,
      usuarioCreacion,
      area,
    });
    user.rol = Roles.FUNCIONARIO;
    errores = await validate(user);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await userRepo.save(user);

    // Return user
    return res.json(user);
  } catch (error) {
    logger.apierror("No se pudo registrar el usuario " + error);
    return res.status(500).json({ message: "Algo salio mal: " + error });
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
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Algo salio mal " + error });
  }
};

const me = (_: Request, res: Response) => {
  return res.status(200).json(res.locals.user);
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
  return res.status(200).json({ success: true });
};

const getAreas = (req: Request, res: Response) => {
  res.status(200).json({ areas: Areas });
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const area = res.locals.user.area;
    const users = res.locals.user.rol === Roles.ADMIN 
    ? await userRepo.find() 
    : await userRepo.find({where: {area}});

    const userFirst = users.sort((x, y) =>
      x.username === res.locals.user.username
        ? -1
        : y.username === res.locals.user.username
        ? 1
        : 0
    );
    return res.json(userFirst);
  } catch (error) {
    return res.status(500).json({ message: "Algo salio mal" + error });
  }
};


const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", user, auth, me);
router.get("/logout", logout);
router.get("/areas", getAreas);
router.get("/", user, auth, getUsers);
export default router;
