import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { IViaje } from '../types/IViaje'; // ✅ importamos el tipo de datos de viaje
import { consultarViajes } from "@/firebase/funciones"; // ✅ función que lee viajes desde Firebase
import { MapPin } from "lucide-react-native"; // ✅ ícono decorativo (igual que el BookOpen)

// =======================================================
// 🚚 COMPONENTE PRINCIPAL: VIAJES
// =======================================================
export default function Viajes() {

  // 🔹 1. Definimos los estados
  const [viajes, setViajes] = useState<IViaje[]>([]);  // lista de viajes
  const [loading, setLoading] = useState<boolean>(false); // indicador de carga

  // 🔹 2. Función auxiliar: agrega viajes al listado
  const handleAddViaje = (viaje: IViaje) => {
    setViajes((prev) => [...prev, viaje]); // acumula los viajes traídos desde Firebase
  };

  // 🔹 3. useEffect: ejecuta la consulta solo una vez al cargar la pantalla
  useEffect(() => {
    console.log("📡 Consultando viajes del chofer...");
    setViajes([]);      // limpia el listado anterior
    setLoading(true);   // activa el spinner

    consultarViajes(handleAddViaje)
      .then(() => setLoading(false)) // si todo sale bien, desactiva el spinner
      .catch((err) => {
        console.error("❌ Error al cargar viajes:", err);
        setLoading(false); // aunque falle, apaga el spinner
      });
  }, []); // 👈 se ejecuta solo al montar el componente

  // 🔹 4. Renderizado del contenido
  return (
    <View style={styles.container}>
      {/* Encabezado con ícono y título */}
      <View style={styles.titulo}>
        <View style={styles.tituloFila}>
          <MapPin size={22} color="#1b2a2f" style={{ marginRight: 8 }} />
          <Text style={styles.tituloTexto}>
            {loading ? "Cargando viajes..." : "Viajes registrados:"}
          </Text>
        </View>

        {/* Mensaje si no hay viajes */}
        {viajes.length === 0 && !loading && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No se encontraron viajes</Text>
            <Text style={styles.emptyText}>
              Cuando el administrador cargue tus recorridos, aparecerán aquí.
            </Text>
          </View>
        )}
      </View>

      {/* Contenido principal (Scroll con los viajes) */}
      <View style={styles.scrollView}>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#FF6F61" />
          </View>
        ) : (
          <ScrollView>
            {viajes.map((viaje, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {viaje.origen} → {viaje.destino}
                </Text>
                <Text style={styles.cardText}>📅 Fecha: {viaje.fecha}</Text>
                <Text style={styles.cardText}>🛣️ Kilómetros: {viaje.kilometros}</Text>
                <Text style={styles.cardText}>👤 Chofer: {viaje.choferEmail}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// =======================================================
// 🎨 ESTILOS – PALETA: Coral (#FF6F61), Verde oscuro (#1b2a2f), Gris claro (#f5f5f5)
// =======================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 90,
  },
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
  scrollView: {
    flex: 3,
    width: "100%",
    height: 600,
    marginTop: 10,
  },
  loading: {
    marginTop: 70,
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderLeftWidth: 4,
    borderColor: "#FF6F61", // coral
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
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FF6F61", // coral
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
});




