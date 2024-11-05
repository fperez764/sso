'use client'
import Button from "@/components/ui/Button";
import ComboBox from "@/components/ui/ComboBox";
import ToastCard from "@/components/ui/ToastCard";
import { BuildingLibraryIcon, CheckIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
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
dayjs.extend(utc)
dayjs.extend(timezone)


export default function ReportePagos() {
  const {user} = useAuthState();
  const [mostrarTutorial, setMostrarTutorial] = useState(false);
  const [clientePlan, setClientePlan] = useState(user?.clientePlanes[0]);
  const [periodos, setPeriodos] = useState<Periodo[]|null>(null);
  const [paquetes, setPaquetes] = useState<Plan[]|null>(null);
  const [cant, setCant] = useState(1);
  //variable para mostrar el popup
  const [openPopup, setOpenPopup] = useState(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const getPeriodosPagable = async () => {
    if(!clientePlan) return;
    try {
      const periodosCliente = await getPeriodosCliente(clientePlan.id);
      setPeriodos(periodosCliente);      
    } catch (error) {
      console.error('Algo salio mal al buscar el periodo pagable', error);
    }
  }

  const getPaquetesExtraPlan = async () => {
    if(!clientePlan) return;
    try {
      const res = await getPaquetesPlan(clientePlan.plan.servicio.id);
      if(!res.planes) toast.error('Plan sin paquetes para compra');
      setPaquetes(res.planes);      
    } catch (error) {
      console.error('Algo salio mal al buscar paquetes para compra del plan', error);
    }
  }

  useEffect(() => {
    setClientePlan(user?.clientePlanes[0])
  }, [user]);

  useEffect(() => {
    getPeriodosPagable();
    getPaquetesExtraPlan();
  }, [clientePlan]);

  useEffect(() => {
    if (!mostrarTutorial) return;
    ToastCard(
      <Image src='/images/tutoriallast.jpg' alt='tutorial'
      width={800} height={800} />,
      () => {setMostrarTutorial(false)},
      'w-[80vh] h-[80vh]');
  },[mostrarTutorial]);

  const [num, setNum] = useState('0');

  const pagarPeriodo = (cantidadExtra: number, anual = false) => {
    if(!clientePlan){toast.error('No se selecciono un plan'); return;}
    if(!periodos || periodos.length === 0){toast.error('No se encontró un periodo valido. Por favor contacte soporte'); return;}
  
    let montoTotal = 0
    
    periodos[0]?.clientePlanPeriodoDetalles?.forEach((e) => {
      montoTotal += Number(e.precioUnitario) * Number(e.cantidad)
    });

    const lista = periodos[0]?.clientePlanPeriodoDetalles?.map((e) =>
      <p key={e.id}>{`${e.descripcion} - ${e.cantidad} X ${e.precioUnitario}`} Bs.</p>
    );
    
    if(cantidadExtra > 0) {
      montoTotal += Number(clientePlan?.plan?.monto) * cantidadExtra
      lista.push(<p>{`Periodos adicionales - ${cantidadExtra} X ${clientePlan?.plan?.monto}`} Bs.</p>)
    }

    if(isNaN(montoTotal)) {toast.error('Precio Unitario no valido, contacte soporte.'); return;}
    ToastCard(<div className='w-[50vh]'>
      <div className="p-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p className="font-bold">Servicio: {clientePlan?.plan?.nombre}</p>
        <p>Categoria: {clientePlan?.plan?.servicio?.servicioCategoria}</p>
        {lista}
      </div>
      <div className="p-3 mb-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p>Monto total a pagar: {montoTotal} Bs.</p>
      </div>
    </div>,
      ()=>generarCPT(getPeriodosBodyCPT([periodos[0].id], cantidadExtra, Number(clientePlan?.plan?.monto), montoTotal, anual), '/periodos/solicitud-pagos'),'','Pago de periodos', 'Generar CPT'
    )
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
    if(isNaN(precioUnitario)) {toast.error('Precio Unitario no valido, contacte soporte.'); return;}
    if(!clientePlan) {toast.error('Algo salio mal al recuperar la información de su plan, porfavor contacte a soporte.'); return;}
    if(!periodos || !periodos[0]) {toast.error('Algo salio mal al recuperar la información de su periodo, porfavor contacte a soporte.'); return;}
    ToastCard(
      <div className="p-3 w-[50vh] border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p>{clientePlan.plan.nombre}: {clientePlan.mac}</p>
        <p>Internet Satelital SUBE - {paquete.nombre}</p>
        <p>Costo: Bs. {(precioUnitario).toFixed(2)}</p>
        {/*<InputB value={cant} placeholder='Cantidad' type='number' handleChange={setCant}/>*/}
      </div>,
    ()=>generarCPT(getPaquetesExtraBodyCPT([clientePlan.idPeriodoActual], paquete.id, cant, precioUnitario), '/periodos/solicitud-pagos-megas'),'','Compra de paquetes', 'Generar CPT'
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
        ...(anual && {pagoAnual: true})
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
        montoTotal: precioUnitario*cantidad,
        tipo: "MEGAS",
        canal: "PPTE"
    }
  }

  const generarCPT = async (body: any, url: string) => {
    const gCpt = toast.loading('Generando CPT...');
    try {
      const res = await getCPT(body, url);
      //toast.success(JSON.stringify(res?.data.datos || body), {duration: 100000});
      if(!res) {toast.error('Algo salio mal. Porfavor contacte a soporte', {id: gCpt}); return;}   
      const cptInfo = res;
      toast.dismiss(gCpt);
      ToastCard(<div className="flex flex-col space-y-3">
        <h4>CPT: <span className="font-bold cursor-pointer hover:underline" onClick={() => {
          navigator.clipboard.writeText(cptInfo.cpt);
          toast.success('El codigo CPT se copio a portapapeles')
          }}>{cptInfo.cpt}</span></h4>
        <p>Vigente desde: {dayjs(new Date(cptInfo.inicioVigencia)).format('DD/MM/YYYY')}</p>
        <p>Vigente hasta: {dayjs(new Date(cptInfo.finVigencia)).format('DD/MM/YYYY')}</p>
        <p>Tramite nro. {cptInfo.tramiteId}</p>
      </div>, ()=>{
        navigator.clipboard.writeText(cptInfo.cpt);
        toast.success('El codigo CPT se copio a portapapeles')
      },'',`CPT Creado con exito! id:${cptInfo.idCpt}`);     
    } catch (error) {
      console.error('Error al generar CPT', error);
      toast.error('No se pudo generar el CPT', {id: gCpt});
    }
  }

  const mostrarVideo= (fileLocation: string, videoTitle: string) => {
    ToastCard(
      <video controls className="w-full h-full">
        <source src={fileLocation} type="video/mp4"/>
      </video>,
      () => {},
      'w-[80vh] h-[80vh]', videoTitle);
  }

  if(!clientePlan) return <p>No se pudo recuperar información de sus planes. Por favor contacte a soporte.</p>
  if(!periodos || periodos.length === 0) return <p>No se pudo recuperar información de su periodo. Por favor contacte a soporte.</p>
  return <div className="flex flex-col space-y-4 mt-4">
      <Popup open={openPopup} onClose={handleClosePopup} />
      <div className="flex font-bold space-x-4 text-xl">
        <Image
          src="/images/payment-banco-union.png"
          alt="Logo"
          width={100}
          height={100}
        />
        <h1>Pagos automáticos, las 24 horas del día</h1>
      </div>
      <div className="flex space-x-4 items-center">
        <Button Icon={DevicePhoneMobileIcon} title='Con tu Celular' 
        onClick={() => mostrarVideo('/videos/SUBEPAGOCPTMOVILLAST.mp4', 'Con tu Celular')}/>
        <Button Icon={ComputerDesktopIcon} title='Con tu Navegador' 
        onClick={() => mostrarVideo('/videos/FINALSUBECPTUNINET.mp4', 'Con tu Navegador')} className="bg-orange-500"/>
        <Button Icon={BuildingLibraryIcon} title='Pago en Cajas del Banco' 
        onClick={() => mostrarVideo('/videos/FINALSUBECPTCAJERO.mp4', 'Pago en Cajas del Banco')} className="bg-slate-500"/>
      </div>
      <div className="flex flex-col space-x-4 w-1/3 items-center">
        <label className="text-center">&iquest;No tienes habilitada la opci&oacute;n 'Pago de tr&aacute;mites'?</label>
        <Button Icon={CheckIcon} title='Pago en Banco Unión' 
        onClick={() => mostrarVideo('/videos/UNIPAGOS_DIGITALES_480p.mp4','Pago en Banco Unión')} className="bg-red-500"/>
      </div>
      <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Servicio-Modem - Seleccione el plan para las compras</h3>
        <ComboBox  
          options={user?.clientePlanes.map(cp => `${cp.id}: ${cp.plan.nombre}${cp.mac ? ('-' + cp.mac) : ''}`)} 
          setData={(option)=>setClientePlan(user?.clientePlanes.find(cp => option.includes(cp.mac)))}
          postName='Plan'
        />
      </div>
      <div className="p-4 flex flex-col border-2 border-gray-400 space-y-2 rounded-md">
        <h3 className="font-bold text-xl">Pago de Mensualidad</h3>
        {periodos[0].clientePlanPeriodoDetalles 
          && periodos[0].clientePlanPeriodoDetalles.length > 0 
          && periodos[0].clientePlanPeriodoDetalles.map(detalle => <div className="flex space-x-3">
          <p>Paquete {detalle.descripcion}</p>
          <p>Monto a pagar {detalle.precioUnitario} Bs.</p>
        </div>)}
        <p>Periodo {dayjs.tz(periodos[0].fechaDesde, "America/La_Paz").format('DD/MM/YYYY')} - {dayjs.tz(periodos[0].fechaHasta, "America/La_Paz").format('DD/MM/YYYY')}</p>
        
        <div className="flex space-between">
          <div className="flex flex-col justify-center">
            Periodos adicionales: <input value={num} onChange={e => setNum(e.target.value)} type="number"/><br/>
            <Button Icon={ShoppingCartIcon} title='Pagar Periodo' onClick={() => pagarPeriodo(Number(num))} className="bg-sky-700"/>
          </div>
          <div className="flex flex-col justify-center">
            <Button Icon={ShoppingCartIcon} title='Pagar un año' onClick={pagarUnAnho} className="bg-green-700"/>
            <p className="w-48 text-center">Por el pago de un año, tienes un mes gratis!</p>
          </div>
          </div>
      </div>
      {clientePlan.estadoPeriodoActual === estado_periodos_enum.PAGADO ? <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Paquetes de Megas Extras</h3>
        {/*TODO: paquetesDisponibles.map*/}
        {/* {JSON.stringify(paquetes)} */}
        <div className="grid grid-cols-3 gap-4 text-center my-4">
        {!!paquetes && paquetes.length>0 && paquetes.map(p => <div className="flex flex-col border-2 border-gray-400 rounded-md p-4" key={p.id}>
          <h4 className='font-bold'>{p.extra?.cantidad > 0 ? `${p.extra?.cantidad} ${p.extra?.unidad || "MB"}`: `${p.descripcion}`}</h4>
          <p>Bs. {p.monto}</p>
          <Button Icon={ShoppingCartIcon} title='Comprar' onClick={() => comprarPaquete(p)} className="bg-sky-700"/>
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
