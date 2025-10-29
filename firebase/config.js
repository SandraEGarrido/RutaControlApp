// 🔥 Importamos los módulos necesarios de Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// 🔧 Configuración del proyecto RutaControlApp
const firebaseConfig = {
  apiKey: "AIzaSyBsF3pNJ8arKH0uTdusTN8d1salzK7I_gc",
  authDomain: "rutacontrolapp.firebaseapp.com",
  projectId: "rutacontrolapp",
  storageBucket: "rutacontrolapp.appspot.com",
  messagingSenderId: "142858147279",
  appId: "1:142858147279:web:9a550cd41ab24e43406eba"
};

// 🚀 Inicializamos la app solo si no existe otra
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 🔐 Configuramos la autenticación con persistencia local
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 💾 Inicializamos Firestore
const db = getFirestore(app);

// 🧩 Mensaje de confirmación
console.log("✅ Firebase y Firestore conectados correctamente a RutaControlApp");

// 📤 Exportamos para usar en otros módulos
export { app, auth, db };
