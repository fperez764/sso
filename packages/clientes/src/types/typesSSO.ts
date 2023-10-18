export type User = {
      id: string
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
        id: string
        nombres: string
        primerApellido: string
        segundoApellido: string
        nroDocumento: number
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
      }

  export type Plan = {
        id: string
        codigo: string
        nombre: string
        monto: string
        datosTecnicos?: string
        servicio?: Servicio
        clientePlanEquipos?: ClientePlanEquipo[]
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

  export type Detalle = {
      id?: string
      codigo?: string
      descripcion: string
      cantidad?: string
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