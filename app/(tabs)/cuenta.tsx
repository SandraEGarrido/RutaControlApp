import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { router } from 'expo-router';

export default function CuentaScreen() {
  const currentUser = auth.currentUser;

  // 🔐 Función para cerrar sesión
  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        router.replace("/login"); // redirige al login
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* 🧍‍♂️ Avatar del usuario */}
      <Image
        style={styles.avatar}
        source={require('@/assets/images/avatar_default.png')}
      />


      {/* 🧾 Información del usuario */}
      <View style={styles.infoContainer}>
        <Text style={styles.nombre}>Sesión iniciada</Text>
<Text style={styles.email}>{currentUser?.email}</Text>

      </View>

      {/* 🔘 Botón para cerrar sesión */}
      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "#FF6F61",
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  nombre: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1b2a2f", // verde oscuro de tu paleta
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  botonCerrar: {
    backgroundColor: "#FF6F61", // coral
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
