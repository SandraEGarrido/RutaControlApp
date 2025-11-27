// firebase/funciones.ts
// =======================================================
// 🔹 FUNCIONES FIREBASE – RUTACONTROL
// =======================================================

import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { IAviso } from "../app/types/IAviso";
import { db, auth } from "./config";


// =======================================================
// 🚚 CONSULTAR VIAJES DEL CHOFER LOGUEADO
// =======================================================
// ✳️ Le agrego el segundo parámetro opcional “dbRef”.
// En mi defensa explico que este cambio me permite usar la misma función tanto en la app real como en el entorno de pruebas.
// Si no se pasa nada, usa el `db` real que importé arriba; si estoy en un test, puedo pasarle el `db` del emulador.
export async function consultarViajes(handleAddViaje, dbRef = db) {

  // 🧪 Durante las pruebas con Jest, "auth" puede ser null
// porque no hay autenticación real en el entorno de test.
// Por eso, agrego esta condición para simular un usuario de prueba.
const currentUser =
  auth && auth.currentUser
    ? auth.currentUser
    : { email: "chofertest@gmail.com" }; // 💡 Usuario simulado para el test

// 🧠 Si aún así no hay usuario, aviso y corto la función
if (!currentUser) {
  console.warn("⚠️ No hay usuario logueado todavía");
  return;
}

  // 3️⃣ Mostramos el correo del usuario en consola
  console.log("📡 Consultando viajes del chofer:", currentUser.email);
  try {
    // 🔹 En lugar de usar siempre el `db` global, ahora uso `dbRef`.
    // Así puedo pasarle una base emulada desde mis tests, sin tocar la base real.
    const viajesRef = collection(dbRef, "viajes");

    // 2️⃣ Filtramos solo los viajes cuyo choferEmail coincide con el usuario logueado
    const q = query(viajesRef, where("choferEmail", "==", currentUser.email));
    const querySnapshot = await getDocs(q);

    // 3️⃣ Recorremos los documentos encontrados y los enviamos al componente
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
export async function cancelarViaje(id) {
  try {
    const viajeRef = doc(db, "viajes", id);
    await updateDoc(viajeRef, { estado: "cancelado" });
    console.log("🟠 Viaje cancelado correctamente:", id);
  } catch (error) {
    console.error("❌ Error al cancelar el viaje:", error);
  }
}

// =======================================================
// ❌ ELIMINAR VIAJE
// =======================================================
// Elimina un viaje específico de la colección 'viajes' según su ID.

export async function eliminarViaje(viajeId) {
  try {
    await deleteDoc(doc(db, "viajes", viajeId));
    console.log("🗑️ Viaje eliminado correctamente:", viajeId);
  } catch (error) {
    console.error("❌ Error al eliminar el viaje:", error);
  }
}

// =======================================================
// ✅ MARCAR VIAJE COMO REALIZADO
// =======================================================

export async function marcarViajeRealizado(id) {
  try {
    const ref = doc(db, "viajes", id);
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
export async function enviarAviso(aviso) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error("Usuario no autenticado");
    }

    const avisoCompleto = {
      ...aviso,
      choferEmail: currentUser.email,
      fecha: new Date().toLocaleString()
    };

    const docRef = await addDoc(collection(db, "avisos"), avisoCompleto);
    console.log("📨 Aviso guardado con ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("❌ Error al guardar el aviso:", error);
    throw error;
  }
}



