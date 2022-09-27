/** @format */

import { SVGProps } from 'react';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			name: string;
			email: string;
			role: string;
			Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
		};
	}
	interface SolicitudServicio {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		readonly sistema: string;
		readonly prepagado: boolean = false;
		descripcion: string;
		cliente: Cliente;
		servicio: Servicio;
		recibido: boolean = false;
		fecha_recibido: null | Date = null;
		aceptado_comercial: boolean = false;
		fecha_aceptado_comercial: null | Date = null;
		usuario_aceptado_comercial: string;
		aceptado_instalador: boolean = false;
		fecha_aceptado_instalador: null | Date = null;
		usuario_aceptado_instalador: string;
		documentos_comercial: boolean = false;
		fecha_documentos_comercial: null | Date = null;
		usuario_dcumentos_comercial: string;
		documentos_instalador: boolean = false;
		fecha_documentos_instalador: null | Date = null;
		usuario_documentos_instalador: string;
		modem_almacen: boolean = false;
		fecha_modem_almacen: null | Date = null;
		usuario_modem_almacen: string;
		modem_instalador: boolean = false;
		fecha_modem_instalador: null | Date = null;
		usuario_modem_instalador: string;
		instalado: boolean = false;
		fecha_instalado: null | Date = null;
		usuario_instalado: string;
		activado: boolean = false;
		fecha_activado: null | Date = null;
		usuario_activado: string;
		documentos_entregados: boolean = false;
		usuario_documentos_entregados: string;
		fecha_documentos_entregados: null | Date = null;
	}

	interface Cliente {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		nombres: string;
		apellidos: string;
		nroDocumento: string;
		tipoDocumento: string;
		direccion: string;
		telefono: string;
		email: string;
		nit: string;
		razon_social: string;
		tipo_cliente: string;
	}
	interface Servicio {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		categoria: string;
		descripcion: string;
		activo: boolean;
	}

	interface ClienteServicio {
		id: number;
		fecha_activacion: Date;
		usuario_activacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		readonly servicio: Servicio; // NOT NULL
		readonly cliente: Cliente; // NOT NULL
		readonly modemMac: string;
	}

	interface ClienteServicioPaquete {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		servicioPaquete: ServicioPaquete;
		clienteServicioPeriodo: ClienteServicioPeriodo;
		inicioVigencia: Date;
		finVigencia: Date;
		mb_consumidos: number;
		consumido: boolean;
		ilimitado: boolean;
		idOperacion: string;
		cuf: string;
	}
	interface ServicioPaquete {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		nombre: string;
		descripcion: string;
		servicio: Servicio;
		mb_regular: number;
		mb_bono: number;
		precio: number;
		service_profile_reducido: number;
		service_profile_regular: number;
	}

	interface Rol {
		id: number;
		fecha_creacion: Date;
		usuario_creacion: string;
		fecha_baja: Date;
		usuario_baja: string;
		readonly nombre: string;
		readonly descripcion: string;
		permisos: Permiso;
	}

	interface Permiso {
		leer: boolean;
		escribir: boolean;
		crear: boolean;
		borrar: boolean;
	}

	enum AreasLista {
		'Comercial',
		'Activos',
		'Facturacion',
		'Contrataciones',
		'Auxiliares',
		'UTI',
		'Proyectos',
		'Operaciones',
		'Instalaciones',
	}
}
