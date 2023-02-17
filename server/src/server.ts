import { AppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import authRoutes from "./routes/auth.route";
import solicitudesSRoutes from "./routes/solicitudes.route";
import sRespuestaRoutes from "./routes/solicitudRespuestas.route";
import gruposRoutes from "./routes/grupoSolicitudes.route";
import servicioRoutes from "./routes/servicio.route";
import categoriaRoutes from "./routes/categoria.route";
import clienteRoutes from "./routes/cliente.route";
import paqueteRoutes from "./routes/paquete.route";
import flujoRespuestasRoutes from "./routes/flujoSolicitudes.route";
import ticketRoutes from "./routes/ticket.route";
import ticketGrupoRoutes from "./routes/grupoTickets.route";
import ticketRespuestaRoutes from "./routes/ticketRespuestas.route";
import flujoTicketRespuestaRoutes from "./routes/flujoTickets.route";
import abefacRoutes from "./routes/abefac.routes";
import trim from "./middleware/trim.middleware";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
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
app.use("/api/servicios", servicioRoutes);
app.use("/api/paquetes", paqueteRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/facturas", abefacRoutes);

app.use("/api/solicitudes", solicitudesSRoutes);
app.use("/api/solicitudes", sRespuestaRoutes);
app.use("/api/flujoSolicitudes", flujoRespuestasRoutes);
app.use("/api/grupoSolicitudes", gruposRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", ticketRespuestaRoutes);
app.use("/api/flujoTickets", flujoTicketRespuestaRoutes);
app.use("/api/grupoTickets", ticketGrupoRoutes);

const port = process.env.PORT;
app.listen(port, async () => {
  logger.info(`Server corriendo en puerto ${port}`);
  try {
    await AppDataSource.initialize();
    logger.info("DB conectada!");
  } catch (error) {
    logger.error(error);
  }
});
