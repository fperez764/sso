export type User = {
      id: string
      tipoPersona: 'NATURAL' | 'EMPRESARIAL'
      tipoDocumento: string
      numeroDocumento: string
      razonSocial: string
      correo: string
      empresa: string
      persona: Persona,
      clientePlanes: ClientePlan[]
      idCliente: string
  }

  export type Persona = {
        id: string
        nombres: string
        primerApellido: string
        segundoApellido: string
        nroDocumento: string
  }

  export type ClientePlan = {
          id: string
          fechaAlta: Date
          fechaSuspendidoDesde: Date
          fechaSuspendidoHasta: Date
          departamento: string
          provincia: string
          municipio: string
          direccion: string
          plan: Plan
          mac: string
          estadoPeriodoActual: estado_periodos_enum
          idPeriodoActual: string
          estado: string
          observacion: string
      }

      export const estado_periodos_enum= {
        PAGADO: 'PAGADO',
        CREADO: 'CREADO'
      };
      
      export type estado_periodos_enum = (typeof estado_periodos_enum)[keyof typeof estado_periodos_enum]
      

  export type Plan = {
        id: string
        codigo: string
        nombre: string
        descripcion: string
        monto: string
        datosTecnicos: string
        servicio: Servicio
        clientePlanEquipos: ClientePlanEquipo[]
        extra: {
            unidad: string
            cantidad: number
            validity: string
        }
  }
  export type Servicio = {
        id: string
        codigo: string
        nombre: string
        descripcion: string
        servicioCategoria: string
  }
  export type ClientePlanEquipo = {
        id: string
        equipo: Equipo
  }
  export type Equipo = {
    id: string
    codigo: number
    descripcion: string
    extra: { mac: string }
  }

  export type Paquete = { 
      estado: string
      id: string
      tipo: string
      fechaVencimiento: Date
      fechaDesde: Date
      clientePlanPeriodoDetalles: Detalle[]
  }

  export type PaqueteContador = {
    id: string
    fecha_creacion: Date
    fecha_modificacion?: Date
    fecha_inicio: Date
    fecha_fin: Date
    fecha_baja?: Date
    mb_asignados: number
    mb_consumidos: number
    consumido: boolean
    modem_mac: string
    paquete_id: string
    tipo_contabilizado: string
    usuario_creacion: string
    usuario_modificacion: string
    extra: any
  }

  export type Detalle = {
      id?: string
      codigo?: string
      descripcion: string
      cantidad?: number
      precioUnitario: string
      extra?: {
      saldo: number,
      unidad: string,
      abonado: number,
      cantidad: string
      }
  }

  export type PeriodoPagable = {
      estado: string
      id: string
      clientePlanPeriodos: Periodo[]
  }

  export type Periodo = {
      id: string
      fechaVencimiento: Date
      descripcion: string
      fechaDesde: Date
      fechaHasta: Date
      datosPago: string|null
      facturado: string|null
      clientePlanPeriodoDetalles: Detalle[]
  }