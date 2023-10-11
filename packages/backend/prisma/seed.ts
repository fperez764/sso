import { Logger } from '@nestjs/common';
import { PrismaClient, ticket_tipo_enum, users_area_enum } from '@prisma/client';
const prisma = new PrismaClient();
async function main(prisma: PrismaClient) {
  const user = await prisma.users.upsert({
    where: { email: 'sistemas@abe.bo' },
    update: {},
    create: {
      email: 'sistemas@abe.bo',
      username: 'sistemas',
      password:
        '$argon2id$v=19$m=65536,t=3,p=4$84HgU1xLwo9ykXXsb4JaAg$hNN45YBE3DDjQq+/5CucwW9CyBJPYGAUMrAmE3wf7L0',
      rol: 'ADMIN',
    },
  });
  const categoria = await prisma.categoriaServicio.upsert({
    where: { nombre: 'OTROS' },
    update: {},
    create: {
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
  const cliente = await prisma.cliente.upsert({
    where: { razonSocial: 'UTI ABE' },
    update: {},
    create: {
      nroDocumentoFacturacion: '77777777',
      razonSocial: 'UTI ABE',
      usuarioCreacion: 'Seeder',
      contactos: {
        create: [
          {
            nombreCompleto: 'UNIDAD DE TECNOLOGIAS DE LA INFORMACION UTI',
            nroDocumento: '7777777',
            usuarioCreacion: 'Seeder',
            direccion: 'Calle 6 Oeste Nro. 6',
            telefono: '59144114444',
          },
        ],
      },
      clienteServicios: {
        create: [
          {
            activo: true,
            nombreServicio: 'OTRO',
            usuarioCreacion: 'Seeder',
            coordenadas: '-16.543153,-68.084271',
            modems: {
              create: [
                {
                  usuarioCreacion: 'Seeder',
                  mac: '00:06:39:89:4e:77',
                  coordenadas: '-16.543153,-68.084271',
                },
              ],
            },
          },
        ],
      },
    },
    include: { clienteServicios: true },
  });
  const flujoTicket = await prisma.flujoTicket.upsert({
    where: { nombre: 'POR DEFECTO' },
    update: {},
    create: {
      usuarioCreacion: 'Seeder',
      nombre: 'POR DEFECTO',
      descripcion: 'Escoger tipo de flujo despues',
      nombreServicio: 'OTRO',
      tipo: ticket_tipo_enum.OTRO,
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
  try {
    const ticket = await prisma.clienteServicioTicket.upsert({
      where: { id: 1 },
      update: {
        nombreFlujo: 'POR DEFECTO',
      },
      create: {
        usuarioCreacion: 'Seeder',
        origen: 'Seeder',
        descripcion: 'Ticket creado por Seeder',
        nombreFlujo: 'POR DEFECTO',
        idClienteServicio: cliente.clienteServicios[0].id,
        coordenadas: '-16.543153,-68.084271',
        acciones: {
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
  } catch (error) {
    Logger.error('Ticket ya estaba creado:' + error);
  }
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
