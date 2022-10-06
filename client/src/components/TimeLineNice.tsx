import React from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';

const EXAMPLE = [
    {
        data: '2019-12-05',
        status: 'status',
        statusB: 'Solicitud Creada',
        statusE: 'INSTALADOR/COMERCIAL'
    },
    {
        data: '2020-01-21',
        status: 'status',
        statusB: 'Comercial acepta la solicitud',
        statusE: 'COMERCIAL'
    },
    {
        data: '2020-02-25',
        status: 'status',
        statusB: 'Comercial prepara contratos para el cliente',
      statusE: 'DOCUMENTOS_COMERCIAL'
    },
    {
        data: '2020-03-16',
        status: 'status',
        statusB: 'Instalador recibe contratos de ABE',
        statusE: 'DOCUMENTOS_INSTALADOR'
    },
    {
      data: '2020-04-19',
      status: 'status',
      statusB: 'Almacenes alista equipos para instaladores',
      statusE: 'MODEM_ALMACEN'
    },
    {
        data: '2020-04-19',
        status: 'status',
        statusB: 'Almacenes entrega equipos a instaladores',
        statusE: 'MODEM_INSTALADOR'
    },
    {
        data: '2020-05-23',
        status: 'status',
        statusB: 'Equipos instalados',
        statusE: 'INSTALADO'
    },
    {
        data: '2020-05-23',
        status: 'status',
        statusB: 'Equipos activados, servicio activo',
        statusE: 'ACTIVADO'
    },  
    {
        data: '2020-05-23',
        status: 'status',
        statusB: 'Contratos entregados a ABE por instalador',
        statusE: 'DOCUMENTOS_ENTREGADOS'
    }
  ];

export enum AreasAceptacion {
    INSTALADOR = 'INS',
    COMERCIAL = 'COM',
    DOCUMENTOS_COMERCIAL = 'DCOM',
    DOCUMENTOS_INSTALADOR = 'DINS',
    MODEM_ALMACEN = 'ALM',
    MODEM_INSTALADOR = 'MINS',
    INSTALADO = 'INSDO',
    ACTIVADO = 'ACT',
    DOCUMENTOS_ENTREGADOS = 'DNTR',
}
type area = keyof typeof AreasAceptacion;


  //{(Object.keys(AreasAceptacion) as Array<area>).map(key => 

  export default class Timeline extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        curIdx: 0,
        prevIdx: -1
      };
    }
  
    //state = { value: 0, previous: 0 };
  
    render() {
      const { curIdx, prevIdx } = this.state;
      const curStatus = EXAMPLE[curIdx].statusB;
      const curStatusArea = EXAMPLE[curIdx].statusE;
      const prevStatus = prevIdx >= 0 ? EXAMPLE[prevIdx].statusB : '';
  
      return (
        <div>
          <div
            style={{
              width: '100%',
              height: '100px',
              margin: '0 auto',
              marginTop: '0px',
              fontSize: '15px'
            }}
          >
            <HorizontalTimeline isOpenEnding={false} isOpenBeginning={false} isTouchEnabled={true}
              styles={{
                background: '#f8f8f8',
                foreground: '#1A79AD',
                outline: 'red'
              }}
              index={this.state.curIdx}
              indexClick={(index) => {
                const curIdx = this.state.curIdx;
                this.setState({ curIdx: index, prevIdx: curIdx });
              }}
              values={EXAMPLE.map((x) => x.data)}
            />
          </div>
          <div className="text-center">
            {/* Prevoius:-{prevStatus} - Current Select:-{curStatus} */}
            <h3>Estado: {curStatus}</h3>
            <p className='font-bold'>Area: {curStatusArea}</p>
          </div>
        </div>
      );
    }
  }
  