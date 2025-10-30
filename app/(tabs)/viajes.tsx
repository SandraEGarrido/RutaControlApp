// =======================================================
// 🚚 COMPONENTE PRINCIPAL: VIAJES
// =======================================================

// 🔹 Importamos módulos base de React Native
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

// 🔹 Importamos el tipo IViaje, que define la estructura de un viaje
import { IViaje } from '../types/IViaje';

// 🔹 Importamos las funciones de Firebase necesarias
// consultarViajes: obtiene todos los viajes del chofer logueado
// marcarViajeRealizado: cambia el estado del viaje a “realizado”
import { consultarViajes, marcarViajeRealizado, cancelarViaje, eliminarViaje } from "@/firebase/funciones";

// 🔹 Ícono decorativo (de la librería lucide-react-native)
import { MapPin } from "lucide-react-native";

// =======================================================
// 🧭 COMPONENTE PRINCIPAL
// =======================================================
export default function Viajes() {

  // =====================================================
  // 1️⃣ ESTADOS PRINCIPALES
  // =====================================================
  const [viajes, setViajes] = useState<IViaje[]>([]);   // Lista de viajes del chofer
  const [loading, setLoading] = useState<boolean>(false); // Indicador de carga (spinner)

  // =====================================================
  // 2️⃣ FUNCIÓN AUXILIAR: AGREGA VIAJES AL LISTADO
  // =====================================================
  const handleAddViaje = (viaje: IViaje) => {
    // Se usa al traer los viajes desde Firebase.
    // “prev” representa el estado anterior de viajes.
    setViajes((prev) => [...prev, viaje]);
  };

  // =====================================================
  // 3️⃣ MARCAR VIAJE COMO REALIZADO
  // =====================================================
  const handleMarcarRealizado = (id: string) => {
    // Mostramos una alerta de confirmación antes de marcar
    Alert.alert(
      "Confirmar",
      "¿Deseás marcar este viaje como realizado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, marcar",
          onPress: async () => {
            // Si el usuario confirma, actualizamos en Firebase
            await marcarViajeRealizado(id);

            // Y también actualizamos el estado local (sin recargar todo)
            setViajes((prev) =>
              prev.map((v) =>
                v.id === id ? { ...v, estado: "realizado" } : v
              )
            );
          },
        },
      ]
    );
  };

  // =====================================================
  // 4️⃣ MARCAR VIAJE COMO CANCELADO
  // =====================================================
  const handleCancelarViaje = (id: string) => {
    cancelarViaje(id)
      .then(() => {
        // Si la actualización fue exitosa, reflejamos el cambio localmente
        setViajes((viajes) =>
          viajes.map((v) =>
            v.id === id ? { ...v, estado: "cancelado" } : v
          )
        );
      })
      .catch((err) => console.error("❌ Error al cancelar viaje:", err));
  };

  // =====================================================
  // 5️⃣ ELIMINAR VIAJE COMPLETAMENTE
  // =====================================================
  const handleEliminarViaje = (id: string) => {
    eliminarViaje(id)
      .then(() => {
        // Eliminamos el viaje de la lista local
        setViajes((viajes) => viajes.filter((v) => v.id !== id));
      })
      .catch((err) => console.error(err));
  };

  // =====================================================
  // 6️⃣ useEffect: CARGAR VIAJES DESDE FIREBASE
  // =====================================================
  useEffect(() => {
    setViajes([]);      // Limpia cualquier lista anterior
    setLoading(true);   // Activa el spinner

    // Llama a Firebase y trae los viajes del chofer autenticado
    consultarViajes(handleAddViaje)
      .then(() => setLoading(false)) // Desactiva el spinner si todo sale bien
      .catch((err) => {
        console.error("❌ Error al cargar viajes:", err);
        setLoading(false); // Aunque haya error, apagamos el spinner
      });
  }, []); // 👈 Se ejecuta solo una vez (al montar el componente)

  // =====================================================
  // 7️⃣ RENDERIZADO DE LA INTERFAZ
  // =====================================================
  return (
    <View style={styles.container}>

      {/* 🔸 Encabezado principal con ícono y título */}
      <View style={styles.titulo}>
        <View style={styles.tituloFila}>
          <MapPin size={22} color="#1b2a2f" style={{ marginRight: 8 }} />
          <Text style={styles.tituloTexto}>
            {loading ? "Cargando viajes..." : "Viajes registrados:"}
          </Text>
        </View>

        {/* 🔸 Si no hay viajes y no está cargando, mostramos un mensaje */}
        {viajes.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No se encontraron viajes</Text>
            <Text style={styles.emptyText}>
              Cuando el administrador cargue tus recorridos, aparecerán aquí.
            </Text>
          </View>
        )}
      </View>

      {/* 🔸 Sección principal con la lista o el spinner */}
      <View style={styles.scrollView}>
        {loading ? (
          // Si loading es true, muestra el spinner
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF6F61" />
          </View>
        ) : (
          // Si no está cargando, muestra los viajes
          <ScrollView>
            {viajes.map((viaje, index) => (
              <View
                key={index}
                style={[
                  styles.card,
                  viaje.estado === "realizado" && styles.cardRealizado, // verde si está realizado
                  viaje.estado === "cancelado" && styles.cardCancelado, // gris si fue cancelado
                ]}
              >
                {/* 🔹 Datos principales del viaje */}
                <Text
                  style={[
                    styles.cardTitle,
                    viaje.estado === "realizado" && styles.cardTitleRealizado,
                    viaje.estado === "cancelado" && styles.cardTitleCancelado,
                  ]}
                >
                  {viaje.origen} → {viaje.destino}
                </Text>

                <Text style={styles.cardText}>📅 Fecha: {viaje.fecha}</Text>
                <Text style={styles.cardText}>🛣️ Kilómetros: {viaje.kilometros}</Text>
                <Text style={styles.cardText}>👤 Chofer: {viaje.choferEmail}</Text>

                {/* 🔸 Botones de acción según estado */}
                {viaje.estado === "pendiente" ? (
                  <>
                    {/* Botón para marcar como realizado */}
                    <TouchableOpacity
                      style={styles.botonRealizado}
                      onPress={() => handleMarcarRealizado(viaje.id!)}
                    >
                      <Text style={styles.textoBoton}>MARCAR COMO REALIZADO</Text>
                    </TouchableOpacity>
                  </>
                ) : viaje.estado === "realizado" ? (
                  <Text style={styles.textoRealizado}>✅ Viaje realizado</Text>
                ) : (
                  <Text style={styles.textoCancelado}>🚫 Viaje cancelado</Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// =======================================================
// 🎨 ESTILOS VISUALES
// =======================================================
const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 90,
  },
  // Encabezado
  titulo: {
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#E6B800", // dorado institucional
  },
  tituloFila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tituloTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1b2a2f",
    marginLeft: 8,
  },
  // Contenedor del scroll
  scrollView: {
    flex: 3,
    width: "100%",
    height: 600,
    marginTop: 10,
  },
  loading: { marginTop: 70 },

  // 🔹 Tarjetas de viajes
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardRealizado: {
    backgroundColor: "#e6f9e6",
    borderLeftWidth: 4,
    borderColor: "#2e8b57",
  },
  cardCancelado: {
    opacity: 0.6,
    backgroundColor: "#eee",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FF6F61",
    marginBottom: 4,
  },
  cardTitleRealizado: { color: "#2e8b57" },
  cardTitleCancelado: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  cardText: { fontSize: 14, color: "#333", marginBottom: 2 },

  // 🔸 Botones
  botonRealizado: {
    backgroundColor: "#FF6F61",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  textoRealizado: {
    alignSelf: "flex-end",
    color: "#2e8b57",
    fontWeight: "bold",
    marginTop: 10,
  },
  textoCancelado: {
    alignSelf: "flex-end",
    color: "#999",
    fontWeight: "bold",
    marginTop: 10,
  },
  // 🔹 Mensaje de “sin viajes”
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderLeftWidth: 4,
    borderColor: "#FF6F61",
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
    marginTop: 35,
    marginBottom: 40,
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
});




