import { AppDataSource } from "./data-source";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import authRoutes from "./routes/auth.route";
import solicitudesSRoutes from "./routes/solicitudServicio.route";
import gruposRoutes from "./routes/solicitudGrupo.route";
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
    optionSuccessStatus: 200,
  })
);

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/solicitudServicio", solicitudesSRoutes);
app.use("/api/grupo", gruposRoutes);

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
