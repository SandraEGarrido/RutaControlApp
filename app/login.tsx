// =======================================================
// 🔹 Importaciones para iniciar sesión con Google
// =======================================================
import * as WebBrowser from "expo-web-browser"; // Abre y cierra la ventana de autenticación de Google
import * as Google from "expo-auth-session/providers/google"; // Maneja el flujo OAuth con Google
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth"; // Conecta el token de Google con Firebase
import { useEffect, useState } from "react"; // Hook de React para ejecutar lógica después de autenticarse
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { router } from "expo-router";

// Con esta línea me aseguro de que el navegador cierre correctamente
// después de usar la ventana de autenticación de Google.
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  // 🧩 Acá defino los estados locales del formulario
  // Guardo el correo y la contraseña que ingresa el chofer
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ✨ Este estado me permite saber qué input está enfocado
  // Así puedo cambiarle el color del borde cuando el usuario lo selecciona
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // =======================================================
  // 🌈 Configuración del inicio de sesión con Google
  // =======================================================
  // En este bloque preparo la autenticación de Google.
  // Defino mis Client IDs para que Google reconozca esta aplicación.
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com",
    androidClientId: "TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com",
    webClientId: "TU_CLIENT_ID_DE_GOOGLE.apps.googleusercontent.com",
  });


  // Este efecto se ejecuta automáticamente cuando cambia la respuesta del login.
  // Acá detecto si el usuario completó correctamente el inicio de sesión con Google.
  useEffect(() => {
    if (response?.type === "success") {
      // Si la autenticación fue exitosa, obtengo el token que devuelve Google
      const { authentication } = response;

      // Si hay token, creo las credenciales de Firebase con ese token
      if (authentication?.accessToken) {
        const credential = GoogleAuthProvider.credential(
          null,
          authentication.accessToken
        );

        // Inicio sesión en Firebase usando las credenciales de Google
        signInWithCredential(getAuth(), credential)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("Inicio de sesión con Google exitoso:", user.email);

            // Si todo salió bien, lo llevo al panel principal (tabs)
            router.replace("/viajes");

            // Muestro un mensaje confirmando el inicio de sesión
            ToastAndroid.showWithGravity(
              "Inicio de sesión con Google exitoso 🚀",
              ToastAndroid.LONG,
              ToastAndroid.TOP
            );
          })
          .catch((error) => {
            console.log("Error al iniciar con Google:", error);
            ToastAndroid.showWithGravity(
              "No se pudo iniciar sesión con Google.",
              ToastAndroid.LONG,
              ToastAndroid.TOP
            );
          });
      }
    }
  }, [response]);

  // 🔐 Esta función maneja el inicio de sesión tradicional con correo y contraseña
  // Si las credenciales son correctas, ingreso a la app principal
  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ✅ Si el login fue exitoso, guardo el usuario actual
        const user = userCredential.user;
        console.log("Inicio de sesión exitoso:", user.email);

        // 👉 Una vez logueado, lo llevo al panel principal (tabs)
        router.replace("/viajes");

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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View style={styles.container}>
          {/* 🚛 Logo institucional */}
          <Image
            style={styles.logo}
            source={require("../assets/images/rutacontrol_logo2.png.png")} // ✅ corregida la ruta
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

            {/* 🔘 Botón de ingreso tradicional */}
            <TouchableOpacity style={styles.botonIngresar} onPress={login}>
              <Text style={styles.textoBoton}>Ingresar</Text>
            </TouchableOpacity>

            {/* 🌈 Botón adicional de ingreso con Google */}
            {/* Este botón lo agrego como segunda opción de inicio de sesión.
                Al presionarlo, se abre la ventana de selección de cuenta de Google
                y si la autenticación es correcta, el usuario entra directamente. */}
            <TouchableOpacity
              style={styles.botonGoogle}
              onPress={() => promptAsync()}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/color/48/google-logo.png",
                }}
                style={styles.iconoGoogle}
              />
              <Text style={styles.textoGoogle}>Continuar con Google</Text>
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
    marginBottom: 12, // agrego un poco de espacio con el botón de Google
  },

  // 🧡 Texto del botón
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // 🌈 Botón de Google (segunda opción)
  botonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#1b2a2f",
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  iconoGoogle: {
    width: 28,
    height: 28,
    marginRight: 10,
  },
  textoGoogle: {
    color: "#1b2a2f",
    fontSize: 16,
    fontWeight: "bold",
  },
});
