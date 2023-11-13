type Data = {
	message: string;
	data?: any;
};
export type DataModem = {
	id: string,
	nombre: string, 
	plan: string, 
	descripcion: string, 
	bloqueado: boolean, 
	url?: string
}

export type ReporteContador = {
	consumoTotalRegularMB?: number
	consumoTotalBonoMB?: number
	consumoTotalReducidoMB?:number
	consumoTotalNoQMMB?: number
}

export enum Hubs {
	NEWTEC = 'newtec',
	GILAT = 'gilat',
	NOID = 'No Identificado'
}

export enum ManufacterMacs {
	NEWTEC = '000639',
	GILAT = '00A0AC',
}