// Import Firestore functions we need
// (Importamos las funciones necesarias de Firestore)
import { collection, query, where, getDocs } from "firebase/firestore";

// Import database (db) and authentication (auth) from our config file
// (Importamos la base de datos y la autenticación desde config.js)
import { db, auth } from "./config";

// Main function to get the subjects (materias) for the current logged user
// (Función principal que obtiene las materias del usuario logueado)
export async function consultarMaterias() {

  // Get the current authenticated user from Firebase Auth
  // (Obtenemos el usuario actualmente autenticado)
  const currentUser = auth.currentUser;

  // Check if there's a logged user before trying to access Firestore
  // (Verificamos si hay un usuario logueado antes de acceder a Firestore)
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return; // (Si no hay usuario, salimos de la función)
  }

  // Show in console which user is currently authenticated
  // (Mostramos en consola qué usuario está autenticado)
  console.log("👤 Usuario actual:", currentUser.email, currentUser.uid);

  // Create a Firestore query to find all documents in "alumnos"
  // where the field "uid" matches the current user's UID
  // (Creamos una consulta a Firestore que busca en la colección "alumnos"
  // los documentos donde el campo "uid" coincide con el UID del usuario actual)
  const q = query(collection(db, "alumnos"), where("uid", "==", currentUser.uid));

  try {
    // Execute the query and wait for the results
    // (Ejecutamos la consulta y esperamos los resultados)
    const querySnapshot = await getDocs(q);

    // If the query returned no documents
    // (Si no se encontraron documentos)
    if (querySnapshot.empty) {
      console.warn("⚠️ No se encontraron materias para este usuario.");
      return; // (Salimos de la función si no hay resultados)
    }

    // Loop through each document returned by Firestore
    // (Recorremos cada documento devuelto por Firestore)
    querySnapshot.forEach((doc) => {
      // Log the document ID and its data in the console
      // (Mostramos el ID del documento y sus datos en la consola)
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    // If there is an error accessing Firestore, show it in console
    // (Si ocurre un error al acceder a Firestore, lo mostramos en consola)
    console.error("❌ Error al consultar Firestore:", error);
  }
}


