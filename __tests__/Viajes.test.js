/**
 * ✅ TEST DE INTEGRACIÓN – COMPONENTE VIAJES
 * En este test quiero comprobar que mi componente `Viajes`
 * puede leer los datos desde una base de datos Firestore,
 * pero usando el EMULADOR local (no la base real).
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, setDoc, doc } from "firebase/firestore";
import Viajes from "../app/(tabs)/viajes"; // ajusto la ruta según mi estructura real

// 🔹 Aumento el tiempo máximo de ejecución del test
// porque a veces el emulador tarda un poco en responder
jest.setTimeout(30000);

test("muestra los viajes desde Firestore emulado", async () => {
  // 1️⃣ Primero creo un entorno de pruebas local con Firestore emulado.
  // Esto me permite trabajar con una base de datos falsa
  // que no afecta los datos reales de Firebase.
  const testEnv = await initializeTestEnvironment({
    projectId: "testing-rutacontrolapp",
    firestore: { host: "127.0.0.1", port: 8080 },
  });

  // 2️⃣ A partir del entorno, obtengo una referencia al Firestore local.
  // Este `db` será la base de datos que use mi test.
  const db = testEnv.unauthenticatedContext().firestore();

  // 3️⃣ Ahora creo un viaje de prueba (mock) con datos reales.
  // Lo inserto directamente en la colección "viajes" del emulador.
  const viajesRef = collection(db, "viajes");
  await setDoc(doc(viajesRef, "1"), {
    origen: "Plaza Huincul",
    destino: "Neuquén",
    fecha: "25-11-2025",
    kilometros: 120,
    choferEmail: "chofertest@gmail.com",
    estado: "pendiente",
  });

  // 4️⃣ Luego renderizo el componente Viajes, pasándole el `db` del emulador.
  // Así el componente leerá desde la misma base de datos que mi test acaba de crear.
  render(<Viajes db={db} />);

  // 5️⃣ Espero a que el componente termine de cargar los datos
  // y verifico que aparezcan en pantalla los textos que agregué.
  await waitFor(() => {
    // Espero que se vea el origen
    expect(screen.getByText(/Plaza Huincul/i)).toBeTruthy();

    // Espero que se vea el destino
    expect(screen.getByText(/Neuquén/i)).toBeTruthy();

    // Espero que se vea el estado del viaje
    expect(screen.getByText(/pendiente/i)).toBeTruthy();
  });

  // 6️⃣ Finalmente limpio el entorno de prueba.
  // Esto elimina la base emulada y deja todo como estaba.
  await testEnv.cleanup();
});
