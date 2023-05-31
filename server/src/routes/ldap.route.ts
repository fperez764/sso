import { Request, Response, Router } from "express";
import User from "../entities/User.entity";
import { AppDataSource } from "../data-source";
import ldap from "ldapjs";
import jwt from "jsonwebtoken";
import { isEmpty } from "class-validator";
import cookie from "cookie";
import logger from "../utils/logger";
import bcrypt from "bcrypt";


const userRepo = AppDataSource.manager.getRepository(User);


const authenticateZimbra = async (username: string, password: string) => {
  return new Promise(function(resolve, reject){
    try{
      const client = ldap.createClient({
        url: process.env.LDAP_SERVER,
      });
      client.bind(`uid=${username},ou=people,dc=abe,dc=bo`, password, function(err){
        if(err) logger.error('LDAP error:' + err);
        resolve(err ? false : true);
      });
    }
    catch(err){
      reject('Algo salio mal al autenticar usuario por LDAP');
    }
  });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    let errors: any = {};
    if (isEmpty(username)) errors.username = "Usuario no puede estar vacio";
    if (isEmpty(password)) errors.password = "Contraseña no puede estar vacia";
    if (Object.keys(errors).length > 0) return res.status(400).json(errors);
    const user = await userRepo.findOne({ where :{username} });
    if (!user) return res.status(404).json({ username: "Usuario no existe" });
    logger.warn(process.env.NODE_ENV === 'development' ? 'AMBIENTE DESARROLLO' : ('LDAP AUTHENTICATION: login: ' + username));
    const authenticated = process.env.NODE_ENV ==='development' 
    ? await bcrypt.compare(password, user.password)
    : await authenticateZimbra(username, password);
    if (!authenticated) {
      return res.status(401).json({ password: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 36000,
        path: "/",
      })
    );
    return res.status(200).json({ user });
  } catch (error) {
    logger.apierror("login: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const router = Router();
router.post("/login", login);

export default router;
