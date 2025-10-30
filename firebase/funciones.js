// firebase/funciones.ts
// =======================================================
// 🔹 FUNCIONES FIREBASE – RUTACONTROL
// =======================================================

import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./config";


// =======================================================
// 🚚 CONSULTAR VIAJES DEL CHOFER LOGUEADO
// =======================================================
// Esta función busca en la colección "viajes" los registros 
// que pertenecen al usuario actualmente autenticado (chofer).
export async function consultarViajes(handleAddViaje) {

  // Obtenemos el usuario autenticado desde Firebase Auth
  const currentUser = auth.currentUser;


  // Verificamos si hay usuario logueado
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return;
  }

  // 3️⃣ Mostramos el correo del usuario en consola
  console.log("📡 Consultando viajes del chofer:", currentUser.email);
  try {
    // 1️⃣ Referencia a la colección 'viajes' en Firestore
    const viajesRef = collection(db, "viajes");

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
// 📝 AGREGAR NUEVO VIAJE
// =======================================================
// Permite registrar un nuevo viaje en la colección "viajes".
export async function agregarViaje(viaje) {
  try {
    const docRef = await addDoc(collection(db, "viajes"), viaje);
    console.log("✅ Viaje agregado con ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error al agregar el viaje:", error);
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
// Guarda un comentario general o aviso de parte del chofer.
export async function comentar(comentario) {
  try {
    const docRef = await addDoc(collection(db, "comentarios"), comentario);
    console.log("💬 Comentario agregado con ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error al agregar el comentario:", error);
  }
}



