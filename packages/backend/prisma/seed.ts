import { PrismaClient, flujo_ticket_tipo_enum, users_area_enum } from '@prisma/client';
const prisma = new PrismaClient();
async function main(prisma: PrismaClient) {
  await prisma.users.deleteMany();
  const user = await prisma.users.create({
    data: {
      email: 'sistemas@abe.bo',
      username: 'sistemas',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$84HgU1xLwo9ykXXsb4JaAg$hNN45YBE3DDjQq+/5CucwW9CyBJPYGAUMrAmE3wf7L0',
      rol: 'ADMIN',
    },
  });
  await prisma.categoriaServicio.deleteMany();
  const categoria = await prisma.categoriaServicio.create({
    data: {
      nombre: 'OTROS',
      descripcion: 'Categoria por defecto, engloba todos los servicios',
      usuarioCreacion: 'Seeder',
      activo: true,
      servicios: {
        create: [
          {
            nombre: 'OTRO',
            descripcion: 'Servicio por defecto, engloba todos los servicios',
            usuarioCreacion: 'Seeder',
            activo: true,
          },
        ],
      },
    },
  });
  await await prisma.cliente.deleteMany();
  const cliente = await prisma.cliente.create({
    data: {
      nroDocumentoFacturacion: '77777777',
      razonSocial: 'UTI ABE',
      usuarioCreacion: 'Seeder',
      contactos: {
        create: [
          {
            nombreCompleto: 'UNIDAD DE TECNOLOGIAS DE LA INFORMACION UTI',
            nroDocumento: '7777777',
            usuarioCreacion: 'Seeder',
          },
        ],
      },
      clienteServicios: {
        create: [
          {
            activo: true,
            nombreServicio: 'OTRO',
            usuarioCreacion: 'Seeder',
            modems: {
              create: [{ usuarioCreacion: 'Seeder', mac: '00:06:39:89:4e:77' }],
            },
          },
        ],
      },
    },
  });
  await prisma.flujoTicket.deleteMany();
  const flujoTicket = await prisma.flujoTicket.create({
    data: {
      usuarioCreacion: 'Seeder',
      nombre: 'POR DEFECTO',
      descripcion: 'Escoger tipo de flujo despues',
      nombreServicio: 'OTRO',
      tipo: flujo_ticket_tipo_enum.OTRO,
      flujoTicketAcciones: {
        create: [
          {
            orden: 0,
            area: users_area_enum.ATENCION_CLIENTE,
            accion: 'Confirmar Ticket',
            vigenciaDias: 1,
            usuarioCreacion: 'Seeder',
          },
        ],
      },
    },
  });
}
main(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
