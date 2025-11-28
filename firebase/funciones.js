// =======================================================
// 🔹 FUNCIONES FIREBASE – RUTACONTROL
// =======================================================

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { IAviso } from "../app/types/IAviso";
import { db, auth } from "./config";

// =======================================================
// 🚚 CONSULTAR VIAJES DEL CHOFER LOGUEADO
// =======================================================
// ✳️ Le agrego el segundo parámetro opcional “dbRef”.
// En primera persona: este cambio me permite usar la misma función
// tanto en la app real como en el entorno de pruebas.
// Si no paso nada, usa el `db` real; si estoy en un test, le paso el `db` del emulador.
export async function consultarViajes(handleAddViaje, dbRef = db) {
  // 🧪 Durante las pruebas con Jest, "auth" puede ser null
  // porque no hay autenticación real en el entorno de test.
  // Por eso, simulo un usuario de prueba con un email fijo.
  const currentUser =
    auth && auth.currentUser
      ? auth.currentUser
      : { email: "chofertest@gmail.com" }; // 💡 Usuario simulado para el test

  // 🧠 Si aún así no hay usuario, aviso y corto la función
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return;
  }

  // 3️⃣ Muestro el correo del usuario en consola
  console.log("📡 Consultando viajes del chofer:", currentUser.email);

  try {
    // 🔹 Uso `dbRef` en lugar del `db` global.
    // Así puedo pasarle una base emulada desde mis tests.
    const viajesRef = collection(dbRef, "viajes");

    // 2️⃣ Filtro solo los viajes cuyo choferEmail coincide con el usuario logueado
    const q = query(viajesRef, where("choferEmail", "==", currentUser.email));
    const querySnapshot = await getDocs(q);

    // 3️⃣ Recorro los documentos encontrados y los envío al componente
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const viaje = {
        id: docSnap.id,
        origen: data.origen,
        destino: data.destino,
        fecha: data.fecha,
        kilometros: data.kilometros,
        choferEmail: data.choferEmail,
        estado: data.estado || "pendiente",
      };
      handleAddViaje(viaje);
    });
  } catch (error) {
    console.error("❌ Error al consultar los viajes:", error);
  }
}

// =======================================================
// 🚫 CANCELAR VIAJE (en lugar de eliminarlo)
// =======================================================
// ✳️ Cambio propuesto: también debería aceptar un `dbRef` opcional,
// igual que consultarViajes, para que pueda usarse en tests con emulador.
export async function cancelarViaje(id, dbRef = db) {
  try {
    const viajeRef = doc(dbRef, "viajes", id);
    await updateDoc(viajeRef, { estado: "cancelado" });
    console.log("🟠 Viaje cancelado correctamente:", id);
  } catch (error) {
    console.error("❌ Error al cancelar el viaje:", error);
  }
}

// =======================================================
// ❌ ELIMINAR VIAJE
// =======================================================
// ✳️ Cambio propuesto: también debería aceptar un `dbRef` opcional.
export async function eliminarViaje(viajeId, dbRef = db) {
  try {
    await deleteDoc(doc(dbRef, "viajes", viajeId));
    console.log("🗑️ Viaje eliminado correctamente:", viajeId);
  } catch (error) {
    console.error("❌ Error al eliminar el viaje:", error);
  }
}

// =======================================================
// ✅ MARCAR VIAJE COMO REALIZADO
// =======================================================
// ✳️ Cambio propuesto: también debería aceptar un `dbRef` opcional.
export async function marcarViajeRealizado(id, dbRef = db) {
  try {
    const ref = doc(dbRef, "viajes", id);
    await updateDoc(ref, { estado: "realizado" });
    console.log("✅ Viaje marcado como realizado:", id);
  } catch (error) {
    console.error("❌ Error al actualizar estado:", error);
  }
}

// =======================================================
// 💬 COMENTARIOS O AVISOS
// =======================================================
/**
 * Guarda un aviso enviado por un chofer
 */
export async function enviarAviso(aviso, dbRef = db) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("Usuario no autenticado");
    }

    const avisoCompleto = {
      ...aviso,
      choferEmail: currentUser.email,
      fecha: new Date().toLocaleString(),
    };

    const docRef = await addDoc(collection(dbRef, "avisos"), avisoCompleto);
    console.log("📨 Aviso guardado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error al guardar el aviso:", error);
    throw error;
  }
}



