import { NextFunction, Request, Response } from "express";
import User from "../entities/User.entity";

const auth = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error("Usuario no autenticado");
    return next();
  } catch (err) {
    return res.status(401).json( "No autorizado: " + err.message );
  }
};

export default auth;