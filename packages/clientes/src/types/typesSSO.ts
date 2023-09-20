export type User = {
      id: number
      tipoPersona: 'NATURAL' | 'EMPRESARIAL'
      tipoDocumento: string
      numeroDocumento: number
      razonSocial: string
      correo: string
      empresa: string
      persona: Persona,
      clientePlanes: ClientePlan[]
  }

  export type Persona = {
        id: number
        nombres: string
        primerApellido: string
        segundoApellido: string
        nroDocumento: number
  }

  export type ClientePlan = {
          id: number
          fechaAlta: Date
          fechaSuspendidoDesde: Date
          fechaSuspendidoHasta: Date
          departamento: string
          provincia: string
          municipio: string
          direccion: string
          plan: Plan
          mac: string
      }

  export type Plan = {
        id: number
        codigo: string
        nombre: string
        monto: number
        datosTecnicos: string
        servicio: Servicio
        clientePlanEquipos: ClientePlanEquipo[]
  }
  export type Servicio = {
        id: number
        codigo: string
        nombre: string
        descripcion: string
        servicioCategoria: string
  }
  export type ClientePlanEquipo = {
        id: number
        equipo: Equipo
  }
  export type Equipo = {
    id: number
    codigo: number
    descripcion: string
    extra: { mac: string }
  }

  export type Paquete = { 
      estado: string
      id: number
      tipo: string
      fechaVencimiento: Date
      fechaDesde: Date
      clientePlanPeriodoDetalles: Detalle[]
  }

  export type Detalle = {
      id?: number
      codigo?: string
      descripcion: string
      cantidad?: number
      precioUnitario: number
      extra?: {
      saldo: number,
      unidad: string,
      abonado: number,
      cantidad: number
      }
  }

  export type PeriodoPagable = {
      estado: string
      id: number
      clientePlanPeriodos: Periodo[]
  }

  export type Periodo = {
      id: number
      fechaVencimiento: Date
      descripcion: string
      fechaDesde: Date
      fechaHasta: Date
      datosPago: string|null
      facturado: string|null
      clientePlanPeriodoDetalles: Detalle[]
  }