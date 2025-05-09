'use client'
import ComboBox from "@/components/ui/ComboBox";
import ToastCard from "@/components/ui/ToastCard";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthState } from "@/context/auth";
import { Periodo, Plan, estado_periodos_enum } from "@/types/typesSSO";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getCPT, getPaquetesPlan, getPeriodosCliente } from "@/app/api/route";
import Popup from "./popup";
import { useRouter } from "next/navigation";
import { Box, Button, Divider, Grid, Icon, List, ListItem, ListItemText, Tooltip, useMediaQuery } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { nanoid } from "nanoid";
import RestoreIcon from '@mui/icons-material/Restore';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

dayjs.extend(utc)
dayjs.extend(timezone)


export default function ReportePagos() {
  const { user } = useAuthState();
  const [mostrarTutorial, setMostrarTutorial] = useState(false);
  const [clientePlan, setClientePlan] = useState(user?.clientePlanes[0]);
  const [periodos, setPeriodos] = useState<Periodo[] | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [montoPlan, setMontoPlan] = useState<number>(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [paquetes, setPaquetes] = useState<Plan[] | null>(null);
  const [cant, setCant] = useState(1);
  //variable para mostrar el popup
  const [openPopup, setOpenPopup] = useState(false);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const getPeriodosPagable = async () => {
    if (!clientePlan) return;
    try {
      const periodosCliente: Periodo[] = await getPeriodosCliente(clientePlan.id);
      periodosCliente.forEach((periodo) => {
        for (const detalle of periodo.clientePlanPeriodoDetalles) {
          detalle.fechaDesde = periodo.fechaDesde;
          detalle.fechaHasta = periodo.fechaHasta;
        }
      })
      console.log('periodos cliente', periodosCliente);
      setFechaInicio(periodosCliente[0]?.fechaDesde);
      setFechaFin(periodosCliente[0]?.fechaHasta);
      setPeriodos(periodosCliente);
      setMontoPlan(Number(clientePlan?.plan?.monto));
      setNum('0');
      setAnual(false);
      updateRows(periodosCliente);
    } catch (error) {
      console.error('Algo salio mal al buscar el periodo pagable', error);
    }
  }

  const updateRows = (periodosCliente: Periodo[]) => {
    const rowsPeriodos: Row[] = []
    for (const periodo of periodosCliente) {
      for (const detalle of periodo.clientePlanPeriodoDetalles) {
        rowsPeriodos.push(
          createRow(
            periodo.id,
            detalle.tipo === 'PRINCIPAL' ? `${detalle.descripcion} - Periodo: ${dayjs.tz(detalle.fechaDesde, "America/La_Paz").format('DD/MM/YYYY')} - ${dayjs.tz(detalle.fechaHasta, "America/La_Paz").format('DD/MM/YYYY')}` : detalle.descripcion,
            1,
            Number(detalle.precioUnitario))

        )
      }
    }
    setRows(rowsPeriodos);
  }

  const getPaquetesExtraPlan = async () => {
    if (!clientePlan) return;
    try {
      const res = await getPaquetesPlan(clientePlan.plan.servicio.id);
      if (!res.planes) toast.error('Plan sin paquetes para compra');
      setPaquetes(res.planes);
    } catch (error) {
      console.error('Algo salio mal al buscar paquetes para compra del plan', error);
    }
  }

  useEffect(() => {
    setClientePlan(user?.clientePlanes[0])
  }, [user, periodos]);

  useEffect(() => {
    getPeriodosPagable();
    getPaquetesExtraPlan();
  }, [clientePlan]);

  useEffect(() => {
    if (!mostrarTutorial) return;
    ToastCard(
      <Image src='/images/tutoriallast.jpg' alt='tutorial'
        width={800} height={800} />,
      () => { setMostrarTutorial(false) },
      'w-[80vh] h-[80vh]');
  }, [mostrarTutorial]);

  const [num, setNum] = useState('0');
  const [anual, setAnual] = useState(false);

  const pagarPeriodo = async (cantidadExtra: number, anual = false) => {
    if (!clientePlan) { toast.error('No se selecciono un plan'); return; }
    if (!periodos || periodos.length === 0) { toast.error('No se encontró un periodo valido. Por favor contacte soporte'); return; }

    // let montoTotal = 0

    // periodos[0]?.clientePlanPeriodoDetalles?.forEach((e) => {
    //   montoTotal += Number(e.precioUnitario) * Number(e.cantidad)
    // });

    // const lista = periodos[0]?.clientePlanPeriodoDetalles?.map((e) =>
    //   <p key={e.id}>{`${e.descripcion} - ${e.cantidad} X ${e.precioUnitario}`} Bs.</p>
    // );

    // if(cantidadExtra > 0) {
    //   montoTotal += Number(clientePlan?.plan?.monto) * cantidadExtra
    //   lista.push(<p>{`Periodos adicionales - ${cantidadExtra} X ${clientePlan?.plan?.monto}`} Bs.</p>)
    // }

    // if(isNaN(montoTotal)) {toast.error('Precio Unitario no valido, contacte soporte.'); return;}
    // ToastCard(<div className='w-[50vh]'>
    //   <div className="p-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
    //     <p className="font-bold">Servicio: {clientePlan?.plan?.nombre}</p>
    //     <p>Categoria: {clientePlan?.plan?.servicio?.servicioCategoria}</p>
    //     {lista}
    //   </div>
    //   <div className="p-3 mb-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
    //     <p>Monto total a pagar: {montoTotal} Bs.</p>
    //   </div>
    // </div>,
    //   ()=>generarCPT(getPeriodosBodyCPT([periodos[0].id], cantidadExtra, Number(clientePlan?.plan?.monto), montoTotal, anual), '/periodos/solicitud-pagos'),'','Pago de periodos', 'Continuar'
    // )
    const montoTotal = subtotal(rows);
    await generarCPT(getPeriodosBodyCPT([periodos[0].id], cantidadExtra, Number(clientePlan?.plan?.monto), montoTotal, anual), '/periodos/solicitud-pagos')
  }

  const pagarUnAnho = () => {
    pagarPeriodo(11, true);
  }

  // const prestarse = () => {
  //   ToastCard(
  //     <div className='w-[50vh] my-3'>
  //       <p>¿Está seguro de prestarse 1000 megas? Se agregará el importe de BS. 25 en la factura del siguiente mes.</p>
  //     </div>,
  //     generarCPT,'','Préstamo de 1000 MB', 'Confirmar'
  //   )
  // }

  const comprarPaquete = (paquete: Plan) => {
    const precioUnitario = parseInt(paquete.monto);
    if (isNaN(precioUnitario)) { toast.error('Precio Unitario no valido, contacte soporte.'); return; }
    if (!clientePlan) { toast.error('Algo salio mal al recuperar la información de su plan, porfavor contacte a soporte.'); return; }
    if (!periodos || !periodos[0]) { toast.error('Algo salio mal al recuperar la información de su periodo, porfavor contacte a soporte.'); return; }
    ToastCard(
      <div className="p-3 w-[50vh] border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p>{clientePlan.plan.nombre}: {clientePlan.mac}</p>
        <p>Internet Satelital SUBE - {paquete.nombre}</p>
        <p>Costo: Bs. {(precioUnitario).toFixed(2)}</p>
        {/*<InputB value={cant} placeholder='Cantidad' type='number' handleChange={setCant}/>*/}
      </div>,
      () => generarCPT(getPaquetesExtraBodyCPT([clientePlan.idPeriodoActual], paquete.id, cant, precioUnitario), '/periodos/solicitud-pagos-megas'), '', 'Compra de paquetes', 'Continuar'
    )
  }

  const getPeriodosBodyCPT = (
    idPeriodos: string[],
    pagoExtraCantidad: number,
    pagoExtraMontoUnidad: number,
    montoTotal: number,
    anual = false
  ) => {
    return {
      idPeriodo: idPeriodos,
      pagoExtraCantidad,
      pagoExtraMontoUnidad,
      montoTotal,
      tipo: "PERIODO",
      canal: "PPTE",
      ...(anual && { pagoAnual: true })
    }
  }

  const getPaquetesExtraBodyCPT = (
    idPeriodo: string[],
    idPlan: string,
    cantidad: number,
    precioUnitario: number) => {
    return {
      idPeriodo,
      idPlan,
      cantidad,
      montoTotal: precioUnitario * cantidad,
      tipo: "MEGAS",
      canal: "PPTE"
    }
  }
  const router = useRouter();
  const generarCPT = async (body: any, url: string) => {
    const gCpt = toast.loading('Generando Solicitud de Pago...');
    try {
      const res = await getCPT(body, url);
      //toast.success(JSON.stringify(res?.data.datos || body), {duration: 100000});
      if (!res) { toast.error('Algo salio mal. Por favor contacte a soporte', { id: gCpt }); return; }
      const cptInfo = res;
      toast.dismiss(gCpt);
      toast.loading('Redirigiendo a la pasarela de pagos...');
      setTimeout(() => {
        router.push(cptInfo?.urlRedireccion);
      }, 2000);
    } catch (error) {
      console.error('Error al generar CPT', error);
      toast.error('No se pudo generar el CPT', { id: gCpt });
    }
  }

  function ccyFormat(num: number) {
    return `${num.toFixed(2)}`;
  }

  function priceRow(qty: number, unit: number) {
    return qty * unit;
  }

  function createRow(idPeriodo: string, desc: string, qty: number, unit: number) {
    const price = priceRow(qty, unit);
    return { idPeriodo, desc, qty, unit, price };
  }

  interface Row {
    idPeriodo: string;
    desc: string;
    qty: number;
    unit: number;
    price: number;
  }

  function subtotal(items: readonly Row[]) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  }

  function addOneMonth(fecha: string | Date) {
    let fechaDesde = ''
    if (fecha instanceof Date) {
      fechaDesde = dayjs(fecha).format('YYYY-MM-DD')
    } else if (typeof fecha === 'string') {
      fechaDesde = dayjs(fecha, 'YYYY-MM-DD').format('YYYY-MM-DD')
    } else {
      throw new Error('Invalid date format')
    }
    fechaDesde = dayjs(fechaDesde, 'YYYY-MM-DD')
      .add(1, 'day')
      .format('YYYY-MM-DD')

    const fechaHasta = dayjs(fechaDesde, 'YYYY-MM-DD')
      .add(1, 'month')
      .subtract(1, 'day')
      .format('YYYY-MM-DD')

    return { fechaDesde, fechaHasta }
  }

  const addPeriodoPagableAnual = () => {
    for (let i = 0; i < 11; i++) {
      addPeriodoPagable(true);
    }
  }

  const addPeriodoPagable = (anual: boolean) => {
    try {
      const periodosActuales: Periodo[] = periodos || [];
      const { fechaDesde, fechaHasta } = addOneMonth(fechaFin || new Date());
      const cantidad = Number(num) + 1
      periodosActuales?.push({
        id: nanoid(),
        fechaVencimiento: new Date(),
        descripcion: 'Nuevo periodo pagable',
        fechaDesde: new Date(fechaDesde + 'T04:00:00.000Z'),
        fechaHasta: new Date(fechaHasta + 'T04:00:00.000Z'),
        datosPago: null,
        facturado: null,
        clientePlanPeriodoDetalles: [
          {
            id: '0',
            tipo: 'PRINCIPAL',
            descripcion: clientePlan?.plan?.nombre || '',
            cantidad: 1,
            precioUnitario: montoPlan.toString(),
            fechaDesde: new Date(fechaDesde + 'T04:00:00.000Z'),
            fechaHasta: new Date(fechaHasta + 'T04:00:00.000Z'),
            eliminar: true,
            extra: {
              saldo: 0,
              unidad: '',
              abonado: 0,
              cantidad: ''
            }
          }
        ]
      })
      setFechaInicio(new Date(fechaDesde + 'T04:00:00.000Z'));
      setFechaFin(new Date(fechaHasta + 'T04:00:00.000Z'));
      setNum(cantidad.toString());
      setAnual(anual);
      setPeriodos(periodosActuales);
      updateRows(periodosActuales);
    } catch (error) {
      console.error('Algo salio mal al buscar el periodo pagable', error);
    }
  }
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!clientePlan) return <p>No se pudo recuperar información de sus planes. Por favor contacte a soporte.</p>
  if (!periodos || periodos.length === 0) return <p>No se pudo recuperar información de su periodo. Por favor contacte a soporte.</p>
  return <div className="flex flex-col space-y-4 mt-4">
    <Popup open={openPopup} onClose={handleClosePopup} />
    <div className="flex font-bold space-x-4 text-xl">
      {/* <Image
          src="/images/payment-banco-union.png"
          alt="Logo"
          width={100}
          height={100}
        /> */}
      <h1>Pagos automáticos, las 24 horas del día</h1>
    </div>
    {/* <div className="flex space-x-4 items-center">
        <Button Icon={DevicePhoneMobileIcon} title='Con tu Celular' 
        onClick={() => mostrarVideo('/videos/SUBEPAGOCPTMOVILLAST.mp4', 'Con tu Celular')}/>
        <Button Icon={ComputerDesktopIcon} title='Con tu Navegador' 
        onClick={() => mostrarVideo('/videos/FINALSUBECPTUNINET.mp4', 'Con tu Navegador')} className="bg-orange-500"/>
        <Button Icon={BuildingLibraryIcon} title='Pago en Cajas del Banco' 
        onClick={() => mostrarVideo('/videos/FINALSUBECPTCAJERO.mp4', 'Pago en Cajas del Banco')} className="bg-slate-500"/>
      </div> */}
    {/* <div className="flex flex-col space-x-4 w-1/3 items-center">
        <label className="text-center">&iquest;No tienes habilitada la opci&oacute;n 'Pago de tr&aacute;mites'?</label>
        <Button Icon={CheckIcon} title='Pago en Banco Unión' 
        onClick={() => mostrarVideo('/videos/UNIPAGOS_DIGITALES_480p.mp4','Pago en Banco Unión')} className="bg-red-500"/>
      </div> */}
    <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
      <h3 className="font-bold text-xl">Servicio - Modem</h3>
      <ComboBox
        options={user?.clientePlanes.map(cp => `${cp.id}: ${cp.plan.nombre}${cp.mac ? ('-' + cp.mac) : ''}`)}
        setData={(option) => setClientePlan(user?.clientePlanes.find(cp => option.includes(cp.mac)))}
        postName='Plan'
      />
    </div>
    <div className="p-4 flex flex-col border-2 border-gray-400 space-y-2 rounded-md">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }} >
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  P
                </Avatar>
              }
              action={
                <Button color="success" startIcon={<ShoppingCartCheckoutIcon />} variant="contained" size='medium' onClick={() => pagarPeriodo(Number(num), anual)} className="bg-sky-500">Pagar</Button>
              }
              title="Pago de Mensualidad"
            />
            <CardContent>
              {isSmallScreen ? (
                <Box>
                  <List>
                    {rows.map((row, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={<Typography>{row.desc}</Typography>}
                          secondary={
                            <>
                              <div>Monto: <b>{row.price}</b></div>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Box px={2}>
                    <Typography variant="h6">
                      Total: <b>{ccyFormat(subtotal(rows))}</b>
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" colSpan={4}>
                          Detalle
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Descripción</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell align="right">Precio unitario</TableCell>
                        <TableCell align="right">Monto</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow key={row.desc}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{row.desc}</TableCell>
                          <TableCell align="right">{row.qty}</TableCell>
                          <TableCell align="right">{row.unit}</TableCell>
                          <TableCell align="right">{ccyFormat(row.price)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell colSpan={3}>Total</TableCell>
                        <TableCell align="right">{ccyFormat(subtotal(rows))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
            <CardActions sx={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: 1,
              px: 2,
              pb: 2,
            }}
              disableSpacing>
              <Button color="primary" variant="outlined" tabIndex={-1} startIcon={<AddShoppingCartIcon />} size='small' title='' onClick={() => addPeriodoPagable(false)} className="bg-sky-500">Agregar Periodo</Button>
              <Tooltip title="Por el pago de un año, tienes un mes gratis!">
                <Button color="success" variant="outlined" tabIndex={-1} startIcon={<AddShoppingCartIcon />} size="small" onClick={() => addPeriodoPagableAnual()} className="bg-lime-600">Habilitar por un año</Button>
              </Tooltip>
              <Button color="warning" variant="outlined" tabIndex={-1} startIcon={<RestoreIcon />} size="small" onClick={() => getPeriodosPagable()} className="bg-orange-500">Restablecer</Button>
            </CardActions>
           
            <p className="whitespace-nowrap text-sm text-center italic text-emerald-600">
              ¡Por el pago de un año, tienes un mes gratis!
            </p>

            <p className="w-48 text-center"></p>
          </Card>
        </Grid>
        {/* <Grid size={{ xs: 6, md: 8 }}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Item>xs=6 md=4</Item>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item>xs=6 md=8</Item>
          </Grid> */}
      </Grid>
      {/*<div className="flex space-between">
          <div className="flex flex-col justify-center">
            Periodos adicionales: <input value={num} onChange={e => setNum(e.target.value)} type="number"/><br/>
            <Button onClick={() => pagarPeriodo(Number(num))} className="bg-sky-700">Pagar Periodo</Button>
          </div>
          <div className="flex flex-col justify-center">
            <Button title='' onClick={pagarUnAnho} className="bg-green-700">Pagar un año</Button>
            <p className="w-48 text-center">Por el pago de un año, tienes un mes gratis!</p>
          </div>
          </div>*/}
    </div>
    {clientePlan.estadoPeriodoActual === estado_periodos_enum.PAGADO ? <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
      <h3 className="font-bold text-xl">Paquetes de Megas Extras</h3>
      {/*TODO: paquetesDisponibles.map*/}
      {/* {JSON.stringify(paquetes)} */}
      <div className="grid grid-cols-3 gap-4 text-center my-4">
        {!!paquetes && paquetes.length > 0 && paquetes.filter(e => Number(e.extra?.cantidad) > 0).map(p => <div className="flex flex-col border-2 border-gray-400 rounded-md p-4" key={p.id}>
          <h4 className='font-bold'>{`${p.descripcion}`}</h4>
          <p>Bs. {p.monto}</p>
          <Button color="success" variant="contained" tabIndex={-1} startIcon={<AddShoppingCartIcon />} size="small" onClick={() => comprarPaquete(p)} className="bg-orange-500">Comprar</Button>
        </div>
        )}
      </div>
      <h3 className="font-bold text-xl">Paquetes de Megas Extras Ilimitados</h3>
      <div className="grid grid-cols-3 gap-4 text-center my-4">
        {!!paquetes && paquetes.length > 0 && paquetes.filter(e => Number(e.extra?.cantidad) === 0).map(p => <div className="flex flex-col border-2 border-gray-400 rounded-md p-4" key={p.id}>
          <h4 className='font-bold'>{`${p.descripcion}`}</h4>
          <p>Bs. {p.monto}</p>
          <Button color="success" variant="contained" tabIndex={-1} startIcon={<AddShoppingCartIcon />} size="small" onClick={() => comprarPaquete(p)} className="bg-orange-500">Comprar</Button>
        </div>
        )}
      </div>
      {/*<div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Préstamo de 1000 Megas</h3>
        <p>Una vez por periodo puedes prestarte 1000 Megas por Bs. 25, este importe será cobrado en su siguiente factura</p>
        <Button Icon={ShoppingCartIcon} title='Prestarse 1000 Megas' onClick={prestarse} className="bg-gray-600"/>
      </div>*/}
    </div> : <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md space-y-3">
      <h3 className="font-bold text-xl">Paquetes de Megas Extras</h3>
      <p>Para comprar paquetes debe pagar su periodo actual.</p>
    </div>}
  </div>;
}
