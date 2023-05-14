import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";

const user = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) return next();
    const userRepo = AppDataSource.manager.getRepository(User);
    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepo.findOneBy({ username });
    res.locals.user = user;
    return next();
  } catch (err) {
    return res.status(401).json(err.message);
  }
};
export default user;