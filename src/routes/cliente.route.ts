import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Cliente from "../entities/cliente/Cliente.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";

const clienteRepo = AppDataSource.manager.getRepository(Cliente);

const crearCliente = async (req: Request, res: Response) => {
  console.log("Crear Cliente");
  const {
    nombreCompleto,
    direccion,
    telefono,
    email,
    nit,
    razonSocial,
    tipoCliente,
  } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const cliente = new Cliente({
      nombreCompleto,
      direccion,
      telefono,
      email,
      nit,
      razonSocial,
      tipoCliente,
      usuarioCreacion,
    });
    await cliente.save();
    return res.json(cliente);
  } catch (error) {
    return res.json(500).json({ error: "No se pudo agregar al cliente" });
  }
};

const getClientes = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const clientesPerPage: number = (req.query.count || 1000) as number;

  try {
    const clientes = await clienteRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "clienteServicios"],
      skip: currentPage * clientesPerPage,
      take: clientesPerPage,
    });

    return res.json(clientes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getCliente = async (req: Request, res: Response) => {
  const { idCliente } = req.params;
  const id = Number.parseInt(idCliente);
  try {
    const cliente = await clienteRepo.findOne({
      where: {
        id,
      },
      relations: {
        //clienteServicios,
      },
    });
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ errror: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", auth, crearCliente);
router.get("/", getClientes);
router.get("/:idCliente", getCliente);
//router.post("/servicio", agregarServicio)

export default router;
