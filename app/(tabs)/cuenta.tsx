import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import { router } from 'expo-router';

export default function TabTwoScreen() {

  const currentUser = auth.currentUser

  const cerrarSesion = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <View style={styles.contaneir}>
      <Image
        style={styles.logo}
        source={{
          uri: `${currentUser?.photoURL}`
        }}
      />
      <Text style={styles.texto}>Usuario:{currentUser?.displayName}</Text>
      <Text style={styles.texto}>Email: {currentUser?.email}</Text>
      <TouchableOpacity style={styles.botonIngresar} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contaneir: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,                   // separa el bloque de texto de la imagen
  },
  logo: {
    width: 220,
    height: 220,
  },
  texto: {
    fontSize: 18,
    fontFamily: "sans-serif-medium", // tipografía más limpia y moderna
    color: "#222",                   // color suave, no tan negro
    marginTop: 6,                    // separación entre líneas (nombre y email)
  },
  botonIngresar: {
    backgroundColor: '#E6B800', // amarillo dorado más suave
    paddingVertical: 12,        // un poquito más de alto
    paddingHorizontal: 25,      // más ancho
    borderRadius: 12,           // bordes más redondeados
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",        // sombra sutil
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,               // sombra en Android
  },
  textoBoton: {
    color: "#333",              // texto oscuro sobre fondo claro
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase", // pone el texto en mayúsculas
    letterSpacing: 0.5,         // espacio entre letras
  },
});
