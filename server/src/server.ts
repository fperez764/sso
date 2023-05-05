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
import resumenTicketsRoutes from "./routes/resumenTickets.route";
import flujoTicketRespuestaRoutes from "./routes/flujoTickets.route";
import clienteServicioRoutes from "./routes/clienteServicio.route";

import trim from "./middleware/trim.middleware";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import user from "./middleware/user.middleware";

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(trim);
app.use(cookieParser());

const allowedOrigins = ['http://localhost:3000', process.env.ORIGIN];
app.use(cors({
  credentials: true,
  optionsSuccessStatus: 200,
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/paquetes", paqueteRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/solicitudes", solicitudesSRoutes);
app.use("/api/solicitudes/respuestas", user, sRespuestaRoutes);
app.use("/api/flujoSolicitudes", flujoRespuestasRoutes);
app.use("/api/grupoSolicitudes", gruposRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets/respuestas", ticketRespuestaRoutes);
app.use("/api/flujoTickets", flujoTicketRespuestaRoutes);
app.use("/api/grupoTickets", ticketGrupoRoutes);
app.use("/api/resumenTickets", resumenTicketsRoutes);
app.use("/api/clienteServicios", user, clienteServicioRoutes);

const port = process.env.PORT;
app.listen(port, async () => {
  logger.info(`${process.env.NODE_ENV} Server corriendo en puerto ${port}`);
  try {
    await AppDataSource.initialize();
    logger.info("DB conectada!");
  } catch (error) {
    logger.error("Error al conectar DB:" + error);
    console.error(error);
  }
});
