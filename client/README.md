Funciones básicas SSO:

SS:
Muestra SS y su estado y permite edicion a usuario creador y equipo asignado
Registra SS mediante API, interface
SS extra:
Cuando una SS se crea, verifica si el cliente existe, y lo relaciona al SS, cc crea el cliente
Cuando una SS se completa, se crea el servicio -> primer periodo (reglas de marcar primer periodo como pagado segun servicio)

Clientes
Muestra protafolio de clientes(datos)
Permite agregar editar clientes por api, interface
Muestra los servicios relacionados al cliente

Cliente-Servicios
Muestra la lista de servicios con su cliente y MAC(si corresponde)
Permite la edicion de planes, bajas, estado mantenimiento
Permite generar prefactura visualizable correspondiente al servicio del mes (tomando en cuenta, mantenimientos o tickets abiertos)

Servicio
Visualiza la lista de servicios junto a sus planes (Permite modificaciones, creacion nuevos por API interface)
Tiene integracion de API GET, POST, para consultar o marcar activo full/limitado por modem MAC para otros microservicios (contador)
:=> Esto dependera de si el modem/servicio tiene paquetes activos
Servicio-Periodo
Visualiza lista de pagos, facturacion, megas asignados, megas usados por periodo de un servicio
(Sumatoria de paquetes comprados en el periodo = plan + extras)

-   Modifcaciones de pagos, facturacion, asignacion de megas en cualquier momento
-   Conteo de megas usados, transient en base al contador-paquetes (si corresponde)

Paquetes-periodo
Tiene integracion de API GET, POST, paquetes por servicio/cliente para otros microservicios (contador)

CONSIDERACIONES
RSS + SSB + OTR pasan a ser un estado de la SS solicitudes de servicio
Paquetes-periodo = Planes periodo => Para genelarizar no hay planes, sino paquetes

Funcionalidades extra:

Gestion usuarios (Usuario tiene un cliente o un funcionario)
Visualizado y gestion usuarios de funcionarios al servidor de LDAP -> Asignacion de roles
Gestion de roles -> Permite crear uno personal por usuario (Roles con permisos se suman OR op)
Gestion de usuarios de clientes -> Asignacion de roles, reseteo de contrasenhas

Integracion al modulo de facturacion:
Replicar menues de:
Reporte facturacion -> Unir facturacion electronica, reporte (Dashboard)
Prefacturacion -> Facturacion : Unir
Servicios cliente -> Parte de menu servicios
Facturacion manual

Integracion HUBS -> Contador
Newtec; Gilat
Dashboard por modem
Operaciones modems
Reporte trafico

Integracion modulo inventarios
Dashboard articulos (listaado y CRUD)
Stock activos
Transferencias
