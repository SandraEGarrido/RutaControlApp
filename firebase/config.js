// Import the functions you need from the SDKs you need
// (Importa las funciones que necesitás del SDK de Firebase)
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth,getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// (Este import cambió de ubicación: ahora viene de 'firebase/auth/react-native')

// TODO: Add SDKs for Firebase products that you want to use
// (Tareas pendientes: agregar otros SDKs de Firebase que quieras usar)
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// (Configuración de tu aplicación web de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyC5mlQJSywjdYnKWWrfYRih7vCfBRVHasQ",
  authDomain: "ifes-native-1570d.firebaseapp.com",
  projectId: "ifes-native-1570d",
  storageBucket: "ifes-native-1570d.firebasestorage.app",
  messagingSenderId: "363650888905",
  appId: "1:363650888905:web:66423359dbebe3faec0918"
};

// ✅ Initialize Firebase App
// (Inicializamos la conexión con Firebase una sola vez)
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with persistence using AsyncStorage
// (Inicializamos la autenticación con persistencia usando AsyncStorage)
// (Esto permite mantener la sesión iniciada incluso si se cierra la app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// ✅ Inicializar Firestore
const db = getFirestore(app);

// 🔍 Verificamos conexión
console.log("🧩 Firestore conectado:", db);

// ✅ Export both app and auth
// (Exportamos tanto la app como la autenticación para usar en otros archivos)
export { app, auth, db };
