// =======================================================
// 🔹 Importaciones para iniciar sesión con Google
// =======================================================
import * as WebBrowser from "expo-web-browser"; // Abre y cierra la ventana de autenticación de Google
import * as Google from "expo-auth-session/providers/google"; // Maneja el flujo OAuth con Google
import * as AuthSession from "expo-auth-session";
import Constants from "expo-constants"; // 📦 Permite acceder a los valores del app.json (como el Client ID)
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

// ✅ Con esta línea me aseguro de que el navegador cierre correctamente
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
  // En lugar de escribir los Client ID directamente en el código,
  // ahora los leo desde el archivo app.json usando "Constants".
  // Esto es más seguro y profesional.

  const SH = "142858147279-i8keve6dddqisodo432f4q0ockmh0don.apps.googleusercontent.com"
  
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: SH, 
    redirectUri:"https://auth.expo.io/@sandraegarrido/proyecto-react-native-ifes"
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
            source={require("../assets/images/rutacontrol_logo2.png.png")}
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
                focusedInput === "email" && styles.inputFocused,
              ]}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
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
            <TouchableOpacity
              style={styles.botonGoogle}
              onPress={() => promptAsync()}
              onPressIn={() => setFocusedInput("google")}
              onPressOut={() => setFocusedInput(null)}
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

// 🎨 Mantengo tus estilos visuales originales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4f8",
  },
  logo: {
    width: 310,
    height: 155,
    marginBottom: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1b2a2f",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
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
  input: {
    borderWidth: 1.8,
    borderColor: "#1b2a2f",
    backgroundColor: "#f9fafc",
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  inputFocused: {
    borderColor: "#ff7b47",
    shadowColor: "#ff7b47",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  botonIngresar: {
    backgroundColor: "#ff7b47",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonGoogle: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    elevation: 2,

  },
  iconoGoogle: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  textoGoogle: {
    fontSize: 15,
    color: "#1b2a2f",
    fontWeight: "500",
  },
  botonGoogleFocused: {
    borderColor: "#ff7b47",
    borderWidth: 2,
    shadowColor: "#ff7b47",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

});

