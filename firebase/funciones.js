// Import the Firestore functions we need
// (Importamos las funciones necesarias de Firestore)
import { getDoc, doc, updateDoc, collection, addDoc } from "firebase/firestore";

// Import the database (db) and authentication (auth) from our config file
// (Importamos la base de datos y la autenticación desde config.js)
import { db, auth } from "./config";

// Main function to get the subjects (materias) for the currently logged-in user
// (Función principal que obtiene las materias del usuario actualmente logueado)
export async function consultarMaterias(handleAddMateria) {
  // Get the currently authenticated user from Firebase Auth
  // (Obtenemos el usuario autenticado actual desde Firebase Auth)
  const currentUser = auth.currentUser;

  // 💡 Verificamos si hay un usuario logueado
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return;
  }
  // Create a reference to the student's document
  // (Creamos una referencia al documento del alumno)
  const ref = doc(db, "alumnos", currentUser.uid);

  // Get the student's document from Firestore
  // (Obtenemos el documento del alumno desde Firestore)
  const alumnoDoc = await getDoc(ref);

  // Extract the student's data
  // (Extraemos los datos del alumno)
  const alumno = alumnoDoc.data();

  // Loop through the student's subjects array
  // (Recorremos el arreglo de materias del alumno)
  alumno.materias.map(async (m) => {
    // Get the subject document
    // (Obtenemos el documento de la materia)
    const materiaDoc = await getDoc(m);

    // Extract subject data
    // (Extraemos los datos de la materia)
    const materia = materiaDoc.data();

    // Get the professor document
    // (Obtenemos el documento del profesor)
    const profesorDoc = await getDoc(materia.profesor);

    // Extract professor data
    // (Extraemos los datos del profesor)
    const profesor = profesorDoc.data();

    // Combine subject and professor data
    // (Combinamos los datos de materia y profesor)
    const datos = {
      ...materia,
      id: materiaDoc.id,
      profesor: profesor,
      handleDesinscribir: () => { },
    };

    // Add the subject to the list
    // (Agregamos la materia al listado)
    handleAddMateria(datos);
  });
}

export async function desinscribir(materiaId) {

  const currentUser = auth.currentUser;

  // 💡 Verificamos si hay un usuario logueado
  if (!currentUser) {
    console.warn("⚠️ No hay usuario logueado todavía");
    return;
  }
  // Create a reference to the student's document
  // (Creamos una referencia al documento del alumno)
  const ref = doc(db, "alumnos", currentUser.uid);

  // Get the student's document from Firestore
  // (Obtenemos el documento del alumno desde Firestore)
  const alumnoDoc = await getDoc(ref);

  // en esta constante guardamos las materias
  // que está inscripto el alumno, pero sin la que queremos borrar o desinscribir
  const materiasActualizar = alumnoDoc.data().materias.filter(materia => materia.id !== materiaId)

  await updateDoc(ref, {
    materias: materiasActualizar
  })
}

export async function comentar(comentario) {

  const docRef = await addDoc(collection(db, "comentarios"),comentario);

  //console.log("Document written with ID: ", docRef.id);

}




