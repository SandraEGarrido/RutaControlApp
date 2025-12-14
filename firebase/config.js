// =======================================================
// 🔥 CONFIGURACIÓN DE FIREBASE – RUTACONTROLAPP (versión de test)
// =======================================================

// 1️⃣ Importo la función principal de Firebase App.
//    Esta función me permite inicializar mi aplicación de Firebase.
import { initializeApp } from "firebase/app";

// 2️⃣ Importo Firestore y una función especial para conectarlo
//    al emulador local, que uso en las pruebas.
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// =======================================================
// 🧩 CONFIGURACIÓN DEL PROYECTO
// =======================================================
// En esta constante guardo las credenciales que me da Firebase
// cuando creo el proyecto. En este caso uso un entorno de TEST
// para no afectar los datos reales de producción.
const firebaseConfig = {
  apiKey: "AIzaSyCbkt-B66lFV4tMWoZIy-76FTjcw6yyS4M",
  authDomain: "testing-de-ifes-2b681.firebaseapp.com",
  projectId: "testing-de-ifes-2b681",
  storageBucket: "testing-de-ifes-2b681.firebasestorage.app",
  messagingSenderId: "955410979374",
  appId: "1:955410979374:web:60e842b65ec49e0a699dbf"
};

// =======================================================
// 🚀 INICIALIZO FIREBASE
// =======================================================
// Inicializo mi aplicación con los datos del proyecto.
// Firebase necesita que la app esté inicializada antes de usar Firestore.
const app = initializeApp(firebaseConfig);

// =======================================================
// 💾 CONEXIÓN CON FIRESTORE
// =======================================================
// A partir de la app que acabo de inicializar, creo la conexión
// con la base de datos Firestore.
const db = getFirestore(app);

// =======================================================
// 🧠 CONEXIÓN CON EL EMULADOR LOCAL
// =======================================================
// En lugar de conectarme a la base real en la nube,
// conecto Firestore al emulador que corre en mi computadora (localhost, puerto 8080).
// Esto me permite hacer pruebas sin riesgo de modificar datos reales.
connectFirestoreEmulator(db, "127.0.0.1", 8080);

// =======================================================
// ✅ CONFIRMACIÓN DE CONEXIÓN
// =======================================================
// Agrego un mensaje en consola para confirmar que todo quedó conectado correctamente.
// Me sirve como referencia cuando ejecuto los tests.
console.log("✅ Firebase (modo test) conectado al emulador correctamente");
console.log("🧪 Modo prueba: usando chofer simulado (chofertest@gmail.com)");


// =======================================================
// 📤 EXPORTACIÓN
// =======================================================
// Exporto la variable db para poder usarla en otros archivos,
// como mis componentes o los archivos de test.
export { db };
