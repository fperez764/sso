import "reflect-metadata";
import { DataSource } from "typeorm";
import SolicitudRespuesta from "./entities/solicitudServicio/SolicitudRespuesta";
import SolicitudServicio from "./entities/solicitudServicio/SolicitudServicio";
import SolicitudGrupo from "./entities/solicitudServicio/SolicitudGrupo";
import User from "./entities/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "master",
  database: "SSO",
  synchronize: true,
  logging: false,
  entities: [User, SolicitudServicio, SolicitudRespuesta, SolicitudGrupo],
  migrations: [],
  subscribers: [],
});
