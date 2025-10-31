// types/IAviso.ts
export interface IAviso {
  id?: string;           // generado por Firestore
  tipo: string;          // "Mecánica", "Administración", "Viajes"
  descripcion: string;   // texto del aviso
  fecha: string;         // fecha legible del envío
  choferEmail: string;   // quién lo envió
}