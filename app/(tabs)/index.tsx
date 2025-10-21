import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { IMateria } from '../types/IMateria';
import Materia from "../../components/ifes/Materia";
import { consultarMaterias } from "@/firebase/funciones"


const initialMaterias: IMateria[] = [
	{
		nombre: "Análisis Matemático 1",
		horario: "Lunes y Viernes de 19 a 21 Hs.",
		profesor: {
			nombre: "Juan",
			apellido: "Perez"
		},
		descripcion: "En Análisis Matemático se abordan las bases del cálculo y sus aplicaciones en distintas áreas. El curso busca desarrollar la capacidad de razonamiento y resolución de problemas mediante herramientas analíticas",
		handlerDesinscribir: () => { }

	},
	{
		nombre: "Introducción a la Programación",
		horario: "Martes y Jueves de 20 a 22 Hs.",
		profesor: {
			nombre: "Ana",
			apellido: "García"
		},
		handlerDesinscribir: () => { }
	}
]

export default function Materias() {

	const [materias, setMaterias] = useState<IMateria[]>(initialMaterias);

	const handlerDesinscribir = (nombre: string) => {
		setMaterias(materias => materias.filter(materia => materia.nombre !== nombre))
	}

	useEffect(() => {
		consultarMaterias();
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.titulo}>
				<Text style={{ fontSize: 20 }} >Las materias en las que estás inscripto:</Text>
			</View>
			<View style={styles.scrollView}>
				<ScrollView>
					{materias.map((materia, index) => {
						return (
							<Materia
								key={index}
								nombre={materia.nombre}
								profesor={materia.profesor}
								horario={materia.horario}
								descripcion={materia.descripcion}
								handlerDesinscribir={handlerDesinscribir}
							/>
						)
					})}
				</ScrollView>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20
	},
	titulo: {
		alignItems: "center",    // centra horizontalmente el texto
		marginTop: 30,           // agrega espacio arriba del título
		marginBottom: 10,        // separa del scroll
	},
	scrollView: {
		flex: 3,
		width: "100%",
		height: 600,
		marginTop: 10
	}
})