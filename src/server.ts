import { AppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import authRoutes from "./routes/auth.route";
import solicitudesSRoutes from "./routes/solicitudServicio.route";
import gruposRoutes from "./routes/solicitudGrupo.route";
import servicioRoutes from "./routes/servicio.route";
import categoriaRoutes from "./routes/categoria.route";
import clienteRoutes from "./routes/cliente.route";
import paqueteRoutes from "./routes/paquete.route";
import trim from "./middleware/trim.middleware";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN || "http://localhost:3000", //process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/solicitudServicio", solicitudesSRoutes);
app.use("/api/grupo", gruposRoutes);
app.use("/api/servicio", servicioRoutes);
app.use("/api/paquete", paqueteRoutes);
app.use("/api/categoria", categoriaRoutes);
app.use("/api/cliente", clienteRoutes);

const port = process.env.PORT;
app.listen(port, async () => {
  console.log(`server listening on port ${port}`);
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
});
