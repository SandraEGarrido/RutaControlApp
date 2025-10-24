import { IProfesor } from "./IProfesor"

export interface IMateria {
    id: string
    nombre: string
    horario: string
    profesor: IProfesor
    descripcion?: string
    handlerDesinscribir: (nombre: string) => void
}
export default {}; // 👈 esto evita el warning sin afectar nada