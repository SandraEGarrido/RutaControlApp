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
  ScrollView,
} from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { router } from "expo-router";

export default function Login() {
  // 🧩 Acá defino los estados locales del formulario
  // Guardo el correo y la contraseña que ingresa el chofer
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ✨ Este estado me permite saber qué input está enfocado
  // Así puedo cambiarle el color del borde cuando el usuario lo selecciona
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // 🔐 Esta función maneja el inicio de sesión
  // Si las credenciales son correctas, ingreso a la app principal
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ✅ Si el login fue exitoso, guardo el usuario actual
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso:", user.email);

        // 👉 Una vez logueado, lo llevo al panel principal (tabs)
        router.replace("/(tabs)");

        // ✅ Muestro un mensaje visual confirmando
        ToastAndroid.showWithGravity(
          "Inicio de sesión exitoso. Bienvenido a RutaControl 🚛",
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      })
      .catch((error) => {
        // ❌ Si hay error, lo registro y muestro aviso
        console.log("Error en el login:", error.code, error.message);
        ToastAndroid.showWithGravity(
          "Error al iniciar sesión. Verifique sus datos.",
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      });
  };

  return (
    // 🧱 Este contenedor evita que el teclado tape los campos
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.container}>
          {/* 🚛 Logo institucional */}
          <Image
            style={styles.logo}
            source={require("../assets/images/rutacontrol_logo.png.png")} // ✅ corregida la ruta
          />

          {/* 🧾 Título principal */}
          <Text style={styles.titulo}>Bienvenido a RutaControl</Text>
          <Text style={styles.subtitulo}>Inicie sesión para continuar</Text>

          {/* 📋 Formulario de login */}
          <View style={styles.form}>
            {/* 📧 Campo de correo electrónico */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "email" && styles.inputFocused, // cambia color si está activo
              ]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onFocus={() => setFocusedInput("email")} // activa el estado
              onBlur={() => setFocusedInput(null)} // lo desactiva al salir
              onChangeText={(text) => setEmail(text)}
            />

            {/* 🔒 Campo de contraseña */}
            <TextInput
              style={[
                styles.input,
                focusedInput === "password" && styles.inputFocused,
              ]}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={password}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => setPassword(text)}
            />

            {/* 🔘 Botón de ingreso */}
            <TouchableOpacity style={styles.botonIngresar} onPress={login}>
              <Text style={styles.textoBoton}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Estilos visuales — tonos azul y coral corporativos
const styles = StyleSheet.create({
  // 🔹 Contenedor general centrado
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8", // azul grisáceo claro
  },

  // 🚛 Logo principal
  logo: {
    width: 310, // agrando un poco el tamaño
    height: 155,
    marginBottom: 30, // dejo aire visual
  },

  // 🧾 Título y subtítulo
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1b2a2f", // azul oscuro corporativo
    marginBottom: 6,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },

  // 📋 Caja del formulario
  form: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  // ✏️ Campos de texto
  input: {
    borderWidth: 1.8,
    borderColor: "#1b2a2f", // azul por defecto
    backgroundColor: "#f9fafc", // gris azulado
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },

  // 🟠 Efecto visual cuando el campo está activo
  inputFocused: {
    borderColor: "#ff7b47", // coral suave
    shadowColor: "#ff7b47",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },

  // 🔘 Botón de ingreso
  botonIngresar: {
    backgroundColor: "#ff7b47", // coral suave
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // 🧡 Texto del botón
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
