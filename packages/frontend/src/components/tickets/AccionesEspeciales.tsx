'use client';
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { ArchiveBoxXMarkIcon, CheckIcon, DocumentTextIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ClienteServicioTicket, ClienteServicioTicketAccion, FlujoTicketAcciones, users_area_enum, users_rol_enum 
} from '@types/typesSSO';
import OrdenMantenimientoForm from '../reportes/OrdenMantenimientoForm';
import ActaEntregaForm from '../reportes/ActaEntregaForm';
import { insertarAccionParaCerrarTicket, rechazarAccion, responderAccion} from '@src/app/api/tickets/acciones';
import { resolverTicket } from '@src/app/tickets/page';
import toast from 'react-hot-toast';
import InputB from '../ui/InputB';
import SelectComboBox from '../ui/SelectComboBox';
import { useAuthState } from '@src/context/auth';

interface Props {
    ticket: ClienteServicioTicket
    accion: ClienteServicioTicketAccion
    handleFeederRefresh: () => void
    showNew?: boolean
    setShowNew: () => void;
}

const AccionesEspeciales = ({ ticket, accion, handleFeederRefresh, showNew = false, setShowNew }: Props) => {
    const { user } = useAuthState();
    const admin = user?.rol === users_rol_enum.ADMIN; 
    const [mostrar, setMostrar] = useState(false);
    const [textoRespuesta, setTextoRespuesta] = useState('Hecho');
	const [sugerenciaSigteAccion, setSugerencia] = useState<FlujoTicketAcciones | null>(null);
    const [accionesNoc, setAccionesNoc] = useState<any[]>([]);

    useEffect(() => {
        setTextoRespuesta('Hecho');
    },[accion]);

    const responder = async (accionPorResponder: ClienteServicioTicketAccion, respuesta = textoRespuesta) => {
        if(respuesta === '') {toast.error('Debe ingresar una respuesta'); return;}

        const accionesValidas = ticket.acciones.filter((a) => !a.fechaBaja).sort((a, b) => b.orden - a.orden);
        if(accionPorResponder.id === accionesValidas[0].id){
            //Caso de que sea la accion de atencion al cliente para cerrar el ticket. Responde y clasifica el ticket
            if(accionPorResponder.area === users_area_enum.ATENCION_CLIENTE && accionPorResponder.accion.includes('CERRAR TICKET')){
                await responderAccion(accionPorResponder.id, respuesta);
                resolverTicket(ticket.id).then(handleFeederRefresh);
                return;
            }
            console.log(sugerenciaSigteAccion);
            toast((t) => (
                <div className='flex flex-col justify-center bg-white rounded-md resize-x w-[60vh] py-12 pr-6'>
                    <div className='flex justify-between'>
                        <h1 className='font-bold text-[17px] hover:underline mx-2'>Esta es la última acción del flujo.<br/>Para confirmar su respuesta debe:</h1>
                        <XCircleIcon className='self-end w-8 h-8 text-red-500 cursor-pointer'onClick={()=>toast.dismiss(t.id)}/>
                    </div>
                    <div className="flex mt-6 space-x-6">
                    <Button title='Solicitar ATENCION AL CLIENTE cerrar el Ticket'
                    onClick={()=> {insertarAccionParaCerrarTicket(accionPorResponder)
                                .then((res) => {
                                    if(res) {
                                        toast.dismiss(t.id);
                                        responderAccion(accionPorResponder.id, respuesta).then((rAccion) =>{
                                            handleFeederRefresh();		
                                        })
                                        return;
                                    }
                                    toast.error('Algo salio mal al crear la última acción. Por favor creela manualmente o contacte soporte');
                                    return;
                                });
                    }} />
                    <Button title='Derivar Ticket a otra Area'  
                    onClick={()=> {
                        setShowNew();
                        document.querySelector('.endWidgets')?.scrollIntoView({ behavior: 'smooth' });
                        toast.dismiss(t.id);
                        return;
                    }} />
                    </div>
                </div>
              ), { duration: 10000000, position: 'top-center' });
        } else{
            await responderAccion(accionPorResponder.id, respuesta);
            handleFeederRefresh();
        }
    };
    
    const rechazar = async (idAccion: number) => {
        const rAccion = await rechazarAccion(idAccion, textoRespuesta);
        if(!rAccion) {setTextoRespuesta(''); return;}
        handleFeederRefresh();
        setTextoRespuesta('');
    };
    
    const valuesNoc = [
        {nombreServicio: 'OTRO', detalle:'Otra acción'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Modem'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo de Fuente del Modem'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo ILB/Transceiver'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo LNB'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo BUC'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Feeder'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Router TP LINK'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Microtik'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Antena'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Canister'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo ATA'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo conectores'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Cable Coaxial'},
        {nombreServicio: 'VSAT', detalle:'Reemplazo Cable de Red'},
        {nombreServicio: 'VSAT', detalle:'Apuntamiento de Antena'},
        {nombreServicio: 'VSAT', detalle:'Traslado de Antena'},
        {nombreServicio: 'VSAT', detalle:'Cambio de configuración SW Modem'}];

    const defaultResponderRechazar = <div className="flex flex-col">
        <InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder="Responder (Completar acción)" type="string" />
        <div className='flex space-x-2'>
            <Button	Icon={CheckIcon} title="Responder" onClick={()=>responder(accion)}
                titleConfirm={`Responderá la acción con "${textoRespuesta}"`}
            />
            <Button Icon={ArchiveBoxXMarkIcon} title="Rechazar" onClick={()=>rechazar(accion.id)} disabled={accion.orden === 0} 
                titleConfirm="Esta seguro que desea rechazar esta solicitud?" 
            />
        </div>
    </div>

    //**Excepciones: */
    //Si no se manda el ticket no muestra nada
    if(!ticket || !accion || !user || ticket.resuelto) return null;
    //Si usuario logueado no deberia poder responder
    if(!admin && !!ticket.fechaBaja &&(user.departamento !== accion.area || user.area.includes(accion.area) || accion.area.includes(user.area)))
      return <p className="text-lg font-semibold">
        Respuesta pendiente (ID :{ticket.porResponder?.id}): 
        <span className='font-bold'>
            {`${(ticket.porResponder?.usuarioAsignado || 'Por asignar')} de ${ticket.porResponder?.area} debe responder`}
        </span>
    </p>
    //Respuestas especiales y por defecto
    switch (accion.area) {
        case users_area_enum.ATENCION_CLIENTE && accion.accion.includes('CERRAR TICKET'):
        return <h2 className='h-12 p-2 text-xl font-bold text-center bg-green-500 rounded-md cursor-pointer hover:text-white' 
          onClick={() => { 
            resolverTicket(ticket.id); 
            if(!accion.fechaRespuesta) responder(accion, 'Se clasifica y cierra ticket'); 
            handleFeederRefresh();}}>
          {!ticket.tipo ? 'RESOLVER Y CLASIFICAR TICKET': 'RE-CLASIFICAR TICKET'}
        </h2>

        case users_area_enum.INSTALACIONES:
        return <>{mostrar 
            ? <OrdenMantenimientoForm ticket={ticket} accion={accion} handleFeederRefresh={handleFeederRefresh}/> 
            : <Button title={`${ticket.ordenMantenimiento ? 'Ver ': 'Generar'} ORDEN DE MANTENIMIENTO`}  
                Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />        
        }
        {ticket.porResponder?.id === accion.id && defaultResponderRechazar}
        </>
        case users_area_enum.ALMACENES:
        case users_area_enum.ALMACENES_LA_GUARDIA:
        case users_area_enum.ALMACENES_AMACHUMA:
        return <>{mostrar 
            ? <ActaEntregaForm ade={accion.actaEntrega} ticket={ticket} accion={accion} handleFeederRefresh={handleFeederRefresh}/> 
            : <Button title={`${accion.actaEntrega ? 'Ver ': 'Generar'} ACTA DE ENTREGA`}  
                Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />
        }
        {ticket.porResponder?.id === accion.id && defaultResponderRechazar}
        </>
        case users_area_enum.NOC:
        return <div className="flex flex-col w-full space-y-4">
          <h4 className='pl-8 text-lg font-bold'>Responder: Acciones realizadas</h4>
          {/*<ComboBox searchEndpoint={`/tickets/clasificacionNoc/${ticket.nombreFlujo}`} postName='Clasificación NOC' setData={setTextoRespuesta}/>*/}
          <SelectComboBox optionsObject={valuesNoc} optionsValue={valuesNoc.map(v => v.detalle)} setData={setAccionesNoc} />
          <InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder="Otras acciones" type="string" className='px-8'/>
          <div className='flex px-8 space-x-2'>
              <Button	Icon={CheckIcon} title="Responder" onClick={()=>
                responder(accion,`${accionesNoc.map(a => a.detalle).toString()}. ${textoRespuesta}`)}
                titleConfirm={`Responderá la acción con "${accionesNoc.map(a => a.detalle).toString()}. ${textoRespuesta}"`}/>
              <Button Icon={ArchiveBoxXMarkIcon} title="Rechazar" onClick={()=>rechazar(accion.id)} 
                disabled={accion.orden === 0} titleConfirm="Esta seguro que desea rechazar esta solicitud?" />
          </div>
        </div>

        default:
        return ticket.porResponder?.id === accion.id ? defaultResponderRechazar : <p className="text-lg font-semibold">
        Respuesta pendiente (ID :{ticket.porResponder?.id}): 
        <span className='font-bold'>
            {`${(ticket.porResponder?.usuarioAsignado || 'Por asignar')} de ${ticket.porResponder?.area} debe responder`}
        </span>
        </p>;
    }
};

export default AccionesEspeciales;
