import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "master",
  database: "SSO",
  schema: "public",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entities/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/**/*.migrations{.ts,.js}"],
  subscribers: [],
});
