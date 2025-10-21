import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  ToastAndroid, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebase/config";

import { router } from 'expo-router';

export default function Login() {

  // Estados para guardar el correo y la contraseña
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 🔐 Función de login
  const login = () => {

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ✅ Usuario autenticado correctamente
        const user = userCredential.user;
        console.log("Te logueaste correctamente!!");

        router.replace("/")

        // Mostrar mensaje de éxito
        ToastAndroid.showWithGravity(
          'Se ha ingresado correctamente!',
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      })
      .catch((error) => {
        // ❌ Error en el login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`errorCode: ${errorCode}, mensaje: ${errorMessage}`);

        // Mostrar mensaje de error visual
        ToastAndroid.showWithGravity(
          'Error en el inicio de sesión. Verifique sus datos.',
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      });
  };

  return (
    // 🧩 Este contenedor evita que el teclado tape los inputs
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://ifes.edu.ar/assets/img/logo.png',
            }}
          />
          <Text style={styles.titulo}>
            Bienvenido al sistema de gestión del alumno de IFES
          </Text>

          <View style={styles.form}>
            <Text style={styles.subtitulo}>Ingrese sus credenciales</Text>

            {/* 📧 Campo de correo electrónico */}
            <TextInput
              style={styles.input}
              placeholder='Ingrese su Usuario'
              keyboardType="email-address" // 👈 muestra el @ en el teclado
              autoCapitalize="none"         // 👈 evita mayúsculas automáticas
              value={email}
              onChangeText={(text) => setEmail(text)} // 👈 actualiza el estado
            />

            {/* 🔒 Campo de contraseña */}
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder='Ingrese su contraseña'
              value={password}
              onChangeText={(text) => setPassword(text)} // 👈 actualiza el estado
            />

            {/* 🔘 Botón de ingreso */}
            <TouchableOpacity style={styles.botonIngresar} onPress={login}>
              <Text style={styles.textoBoton}>INGRESAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Tus mismos estilos, sin cambios
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 18,
    textAlign: "center",
  },
  form: {
    borderColor: "black",
    borderWidth: 2,
    marginTop: 10,
    padding: 20,
    width: "90%",
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6B800",
    height: 60,
    marginTop: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: "center",
  },
  logo: {
    width: 350,
    height: 110,
  },
  botonIngresar: {
    marginTop: 20,
    backgroundColor: '#E6B800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
});
