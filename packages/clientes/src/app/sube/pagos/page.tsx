'use client'
import Button from "@/components/ui/Button";
import ComboBox from "@/components/ui/ComboBox";
import InputB from "@/components/ui/InputB";
import ToastCard from "@/components/ui/ToastCard";
import { BuildingLibraryIcon, CheckIcon, ComputerDesktopIcon, DevicePhoneMobileIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthState } from "@/context/auth";
import { Detalle, Paquete, Periodo, Plan } from "@/types/typesSSO";
import { pagosInstance, ssoInstance } from "@/app/api/route";
import dayjs from "dayjs";
export default function ReportePagos() {
  const {user} = useAuthState();
  const [mostrarTutorial, setMostrarTutorial] = useState(false);
  const [clientePlan, setClientePlan] = useState(user?.clientePlanes[0]);
  const [periodos, setPeriodos] = useState<Periodo[]|null>(null);
  const [paquetes, setPaquetes] = useState<Plan[]|null>(null);
  const [cant, setCant] = useState(1);

  const getPeriodosPagable = async () => {
    if(!clientePlan) return;
    try {
      //http://192.168.238.54:3000/api/cliente-planes/1/periodosPagable
      const res = await ssoInstance?.get(`/cliente-planes/${clientePlan.id}/periodosPagable`);
      if(!res?.data?.datos) {toast.error('Algo salio mal. Porfavor contacte a soporte'); return;}
      setPeriodos(res.data.datos);      
    } catch (error) {
      console.error('Algo salio mal al buscar el periodo pagable', error);
    }
  }

  const getPaquetesExtraPlan = async () => {
    if(!clientePlan) return;
    try {
      //http://192.168.238.54:3000/api/servicios/5/planes?tipo=MEGA_ADICIONAL
      const res = await ssoInstance?.get(`/servicios/${clientePlan.plan?.servicio?.id || '5'}/planes?tipo=MEGA_ADICIONAL`);
      if(!res?.data?.datos) {toast.error('Algo salio mal. Porfavor contacte a soporte'); return;}
      console.info('Paquetes', res.data.datos[0]);
      setPaquetes(res.data.datos.planes);      
    } catch (error) {
      console.error('Algo salio mal al buscar el periodo pagable', error);
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

  const pagarPeriodo = (cantidad: number) => {
    if(!clientePlan){toast.error('No se selecciono un plan'); return;}
    if(!periodos || periodos.length === 0){toast.error('No se encontro un periodo valido. Porfavor contacte soporte'); return;}
    const precioUnitario = parseInt(periodos[0]?.clientePlanPeriodoDetalles[0]?.precioUnitario);
    if(isNaN(precioUnitario)) {toast.error('Precio Unitario no valido, contacte soporte.'); return;}
    ToastCard(<div className='w-[50vh]'>
      <div className="p-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p className="font-bold">Servicio: {clientePlan?.plan?.nombre}</p>
        <p>Categoria: {clientePlan?.plan?.servicio?.servicioCategoria}</p>
        <p>Costo de plan por periodo: {clientePlan?.plan?.monto} Bs.</p>
        <p>Día aniversario: {new Date(clientePlan.fechaAlta).getDay()}</p>
      </div>
      <div className="p-3 mb-3 border-2 border-gray-400 rounded-md flex flex-col space-y-3">
        <p>Monto total a pagar: {cantidad} x Bs. {precioUnitario}</p>
      </div>
    </div>,
      ()=>generarCPT(getPeriodosBodyCPT([periodos[0].id], cantidad, precioUnitario), 'api/periodos/solicitud-pagos'),'','Pago de periodos', 'Generar CPT'
    )
  }

  const pagarUnAnho = () => {
    pagarPeriodo(11);
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
    ()=>generarCPT(getPaquetesExtraBodyCPT([periodos[0].id], clientePlan.id, cant, precioUnitario), 'api/periodos/solicitud-pagos-megas'),'','Compra de paquetes', 'Generar CPT'
    )
  }

  const getPeriodosBodyCPT = (
    idPeriodos: string[], 
    cantidad: number, 
    precioUnitario: number) => {
    return {
        idPeriodo: idPeriodos,
        cantidadPeriodosAdicional: cantidad,
        montoTotal: cantidad * precioUnitario,
        tipo: "PERIODO",
        canal: "PPTE"
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
      const res = await pagosInstance?.post(url, body);
      //toast.success(JSON.stringify(res?.data.datos || body), {duration: 100000});
      if(!res?.data?.datos) {toast.error('Algo salio mal. Porfavor contacte a soporte', {id: gCpt}); return;}   
      const cptInfo = res.data.datos;
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

  if(!clientePlan) return <p>No se pudo recuperar información de sus planes. Porfavor contacte a soporte.</p>
  return <div className="flex flex-col space-y-4 mt-4">
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
        <label className="text-center">No tienes habilitada la opción: Pago de trámites</label>
        <Button Icon={CheckIcon} title='Pago en Banco Unión' 
        onClick={() => mostrarVideo('/videos/UNIPAGOS_DIGITALES_480p.mp4','Pago en Banco Unión')} className="bg-red-500"/>
      </div>
      <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Servicio-Modem</h3>
        <ComboBox 
          value={clientePlan.plan.nombre} 
          options={user?.clientePlanes.map(cp => `${cp.id}: ${cp.plan.nombre}${cp.mac ? ('-' + cp.mac) : ''}`)} 
          setData={(option)=>setClientePlan(user?.clientePlanes.find(cp => option.includes(cp.mac)))} 
          postName='Seleccione el plan para las compras'/>
      </div>
      <div className="p-4 flex flex-col border-2 border-gray-400 space-y-2 rounded-md">
        <h3 className="font-bold text-xl">Pago de Mensualidad</h3>
        <p>Paquete {' Intermedio'}</p>
        <p>Periodo {' 18/09/23 - 17/10/23'}</p>
        <p>Monto a pagar {' 568.00 Bs.'}</p>
        <div className="flex space-x-4 items-start">
          <Button Icon={ShoppingCartIcon} title='Pagar Periodo' onClick={() => pagarPeriodo(1)} className="bg-sky-700"/>
          <div className="flex flex-col justify-center">
            <Button Icon={ShoppingCartIcon} title='Pagar un año' onClick={pagarUnAnho} className="bg-green-700"/>
            <p className="w-48 text-center">Por el pago de un año, tienes un mes gratis!</p>
          </div>
          </div>
      </div>
      <div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Paquetes de Megas Extras</h3>
        {/*TODO: paquetesDisponibles.map*/}
        {JSON.stringify(paquetes)}
        <div className="grid grid-cols-3 gap-4 text-center my-4">
        {paquetes?.map(p => <div className="flex flex-col border-2 border-gray-400 rounded-md p-4" key={p.id}>
          <h4 className='font-bold'>{p.nombre}</h4>
          <p>Bs. {p.monto}</p>
          <Button Icon={ShoppingCartIcon} title='Comprar' onClick={() => comprarPaquete(p)} className="bg-sky-700"/>
          </div>
        )}
      </div>
      {/*<div className="p-2 flex flex-col border-2 border-gray-400 rounded-md">
        <h3 className="font-bold text-xl">Prestamo de 1000 Megas</h3>
        <p>Una vez por periodo puedes prestarte 1000 Megas por Bs. 25, este importe será cobrado en su siguiente factura</p>
        <Button Icon={ShoppingCartIcon} title='Prestarse 1000 Megas' onClick={prestarse} className="bg-gray-600"/>
      </div>*/}
    </div>
  </div>;
}
