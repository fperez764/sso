import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepo = AppDataSource.manager.getRepository(User);
    const token = req.cookies.token;
    if (!token) return next();
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepo.findOneBy({ username });
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).json(err.message);
  }
};
