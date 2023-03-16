import { NextFunction, Request, Response } from "express";
import User from "../entities/User.entity";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: User | undefined = res.locals.user;
    if (!user) throw new Error("Usuario no autenticado");
    return next();
  } catch (err) {
    return res.status(401).json({ error: "No autorizado: " + err.message });
  }
};
