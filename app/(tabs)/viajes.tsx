import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { IMateria } from '../types/IMateria';
import Materia from "../../components/ifes/Materia";
import { consultarMaterias, desinscribir } from "@/firebase/funciones"

import { BookOpen } from "lucide-react-native"; // opcional, si querés el ícono

export default function Materias() {

  const [materias, setMaterias] = useState<IMateria[]>([]);
  const [loading, setLoading] = useState<boolean>(false)

  const actualizarMaterias = (id: string) => {
    setMaterias(materias => materias.filter(materia => materia.id !== id))
    setLoading(false)
  }

  const handlerDesinscribir = (id: string) => {

    setLoading(true)

    desinscribir(id)
      .then(result => actualizarMaterias(id))
      .catch(err => console.error(err))
  }


  const handleAddMateria = (materia: IMateria) => {
    setMaterias(materias => [...materias, materia])
  }

  useEffect(() => {
    console.log("use Effect")
    setMaterias([])

    setLoading(true);


    // consultamos en firebase todas las materias que
    // está inscripto el alumno que se logueo.


    consultarMaterias(handleAddMateria)
      .then(result => setLoading(false))
      .catch(err => setLoading(false))
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.titulo}>
        {/* 🔹 Título principal */}
        <View style={styles.tituloFila}>
          <BookOpen size={22} color="#1b2a2f" style={{ marginRight: 8 }} />
          <Text style={styles.tituloTexto}>
            {loading ? "Espere...." :
              "Las materias en las que estás inscripto:"}
          </Text>
        </View>

        {/* 🔹 Mensaje si no hay materias */}

        {materias.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No se encuentran inscripciones
            </Text>
            <Text style={styles.emptyText}>
              Podés anotarte desde la sección “Servicios” o consultar al
              administrador.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.scrollView}>
        {loading ? <View style={styles.loading}><ActivityIndicator size="large" /></View> :
          <ScrollView>
            {materias.map((materia, index) => {
              return (
                <Materia
                  key={index}
                  id={materia.id}
                  nombre={materia.nombre}
                  profesor={materia.profesor}
                  horario={materia.horario}
                  descripcion={materia.descripcion}
                  handlerDesinscribir={handlerDesinscribir}
                />
              )
            })}
          </ScrollView>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // 🔹 Contenedor general de la pantalla
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 90, // margen superior general
  },

  // 🔹 Encabezado general
  titulo: {
    alignItems: "center",
    marginBottom: 15, // 👈 reducimos un poco porque el recuadro tendrá su propio margen
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#E6B800", // línea dorada debajo del título
  },

  // 🔹 Fila del título (ícono + texto)
  tituloFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // 🔹 Texto principal del encabezado
  tituloTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b2a2f", // verde oscuro
    marginLeft: 8,
  },

  // 🔹 Bloque vacío (sin materias)
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderLeftWidth: 4,
    borderColor: "#E6B800", // línea lateral dorada
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "92%",
    alignSelf: "center",
    marginTop: 35, // 👈✨ nuevo: separación entre el título y el recuadro
    marginBottom: 40, // espacio inferior para respirar
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1b2a2f",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    width: "90%",
    lineHeight: 20,
  },

  // 🔹 Contenedor del Scroll (listado de materias)
  scrollView: {
    flex: 3,
    width: "100%",
    height: 600,
    marginTop: 10,
  },

  loading: {
    marginTop: 70
  }
});




