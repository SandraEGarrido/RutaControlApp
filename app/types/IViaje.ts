// types/IViaje.ts

export interface IViaje {
  id?: string;        // id de documento en Firestore
  origen: string;     // ciudad o punto de partida
  destino: string;    // destino final
  estado: string
  fecha: string;      // fecha del viaje
  kilometros: number; // distancia recorrida
  choferEmail: string;// email del chofer asociado
}
