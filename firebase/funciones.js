// Import the Firestore functions we need
// (Importamos las funciones necesarias de Firestore)
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

// Import the database (db) and authentication (auth) from our config file
// (Importamos la base de datos y la autenticación desde config.js)
import { db, auth } from "./config";

// Main function to get the subjects (materias) for the currently logged-in user
// (Función principal que obtiene las materias del usuario actualmente logueado)
export async function consultarMaterias(handleAddMateria) {
  // Get the currently authenticated user from Firebase Auth
  // (Obtenemos el usuario autenticado actual desde Firebase Auth)
  const currentUser = auth.currentUser;

  // Verify that a user is logged in before accessing Firestore
  // (Verificamos que haya un usuario logueado antes de acceder a Firestore)
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return; // (Si no hay usuario, salimos de la función)
  }

  // Show in console which user is currently authenticated
  // (Mostramos en consola qué usuario está autenticado)
  console.log("👤 Usuario actual:", currentUser.email, currentUser.uid);

  // Create a Firestore query to find all documents in "alumnos"
  // where the field "uid" matches the current user's UID
  // (Creamos una consulta a la colección "alumnos"
  // que busca los documentos donde el campo "uid" coincide con el UID del usuario actual)
  const q = query(
    collection(db, "alumnos"),
    where("uid", "==", currentUser.uid)
  );

  try {
    // Execute the query and wait for the results
    // (Ejecutamos la consulta y esperamos los resultados)
    const querySnapshot = await getDocs(q);

    // Check if the query returned no documents
    // (Verificamos si la consulta no devolvió documentos)
    if (querySnapshot.empty) {
      console.warn("⚠️ No se encontraron materias para este usuario.");
      return; // (Salimos de la función si no hay resultados)
    }

    // Loop through each document returned by Firestore
    // (Recorremos cada documento devuelto por Firestore)
    querySnapshot.forEach((doc) => {
      // Save the student's data
      // (Guardamos los datos del alumno)
      const alumno = doc.data();

      // Recorremos el arreglo de materias del alumno
      // (We loop through the student's subjects array)
      alumno.materias.map(async (m) => {
        try {
          // 🔹 Obtenemos el documento de cada materia usando su referencia en Firestore
          // (Retrieve each subject document from Firestore using its reference)
          const materiaDB = await getDoc(m);

          // 🔹 Extraemos los datos reales del documento de materia
          // (Extract the actual data from the subject document)
          const materia = materiaDB.data();

          // 🔹 Mostramos en consola los datos de la materia obtenida
          // (Log the subject data to the console)
          console.info("📘 Datos de materia:", materia);

          // 🔹 Verificamos si la materia tiene un campo 'profesor' con referencia válida
          // (Check if the subject has a valid 'profesor' reference)
          if (!materia.profesor) {
            console.warn("⚠️ Esta materia no tiene referencia de profesor.");
            return; // (Salimos del bucle si no hay profesor asignado)
          }

          // 🔹 Obtenemos el documento del profesor referenciado en la materia
          // (Retrieve the referenced professor document from Firestore)
          const profesorDB = await getDoc(materia.profesor);

          // 🔹 Si el documento del profesor existe en Firestore...
          // (If the professor document exists in Firestore...)
          if (profesorDB.exists()) {
            // 🔹 Extraemos los datos reales del profesor
            // (Extract the actual data from the professor document)
            const profesor = profesorDB.data();

            // 🔹 Unimos los datos de la materia con los del profesor (sin la referencia)
            // (Combine subject data and teacher data, removing the reference)
            const datos = {
              ...materia,
              profesor: profesor,
              handlerDesinscribir: () => { }
            }
            handleAddMateria(datos);

            // 🔹 Mostramos un resumen completo en una línea
            // (Show a full summary in one line)
            console.info(
              `📘 ${materia.nombre} | 🕓 ${materia.horario} | 👨‍🏫 ${profesor.nombre} ${profesor.apellido} | 📝 ${materia.descripcion}`
            );

          } else {
            // 🔹 Si el documento del profesor no existe, mostramos advertencia
            // (If the professor document doesn't exist, log a warning)
            console.warn("⚠️ No se encontró el documento del profesor.");
          }

        } catch (err) {
          // 🔹 Capturamos cualquier error durante la obtención de datos
          // (Catch any error while retrieving data)
          console.error("❌ Error al obtener datos de materia o profesor:", err);
        }
      }); // 🔚 Fin del recorrido de materias
    });
  } catch (error) {
    // If there is an error accessing Firestore, show it in the console
    // (Si ocurre un error al acceder a Firestore, lo mostramos en consola)
    console.error("❌ Error al consultar Firestore:", error);
  }
}

