"use client"

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react"

type marker = {
    "Estado": string
    "icono": string
    "Actividad": string
    "SERVICIO": string
    "Nombre cliente": string
    "Tipo de cliente": string
    "OTR-RSS": string
    "Latitud": number
    "Longitud": number
    "Departamento": string
    "Provincia": string
    "Municipio": string
    "Localidad o Propiedad": string
}
interface props {
  markers: marker[]
}

const buildMapInfoCardContent = (title: string, body: string): string => {
  return `
  <div class="map_infocard_content">
      <div class="map_infocard_title">${title}</div>
      <div class="map_infocard_body">${body}</div>
  </div>`;
}

export default function Maps({markers}: props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY!,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary('maps');
      const position = {
        lat: -16.543153,
        lng: -68.084271
      };
      const {Marker} = await loader.importLibrary('marker') as google.maps.MarkerLibrary;
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 17,
        mapId: 'MyNextJSMapId'
      }
      //Setup map
      const map =  new Map(mapRef.current as HTMLDivElement, mapOptions);
      // put a marker
      const marker = new Marker({
        map: map,
        position: position,
        title: "Pet found here",
        icon: {
            url: 'marker_flag.png',
            size: new google.maps.Size(32,32)
        },
        animation: google.maps.Animation.DROP
      });

      const infoCard = new google.maps.InfoWindow({
        position: position,
        content: buildMapInfoCardContent('Punto de recojo', 'Mas datos...'),
        minWidth: 200

    })

    infoCard.open({
        map: map,
        anchor: marker
    })
    }
    initMap();
  },[])

  return (
    <div className="h-[900px]" ref={mapRef}/>
  )
}
