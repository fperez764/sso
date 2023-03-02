import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import logger from "./utils/logger";
dotenv.config();

const prod = process.env.NODE_ENV !== "production";

const host = prod ? process.env.URL_DB_PROD : process.env.URL_DB_DEV;
const username = prod
  ? process.env.USERNAME_DB_PROD
  : process.env.USERNAME_DB_DEV;

const password = prod
  ? process.env.PASSWORD_DB_PROD
  : process.env.PASSWORD_DB_DEV;

logger.info("DB: " + host);

export const AppDataSource = new DataSource({
  type: "postgres",
  host,
  port: 5432,
  username,
  password,
  database: "sso",
  schema: "public",
  synchronize: process.env.NODE_ENV !== "production",
  logging: true,
  entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migration/**/*.migrations{.ts,.js}"],
  subscribers: [],
});
