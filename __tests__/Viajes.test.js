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
import Viajes from "app/(tabs)/viajes"; // uso el alias definido en jest.config.js

// 🧩 0️⃣ Mockeo el paquete "expo"
// Lo hago porque Jest no puede cargar los módulos nativos de Expo.
// Con este mock evito errores en el entorno de pruebas.
jest.mock("expo-modules-core", () => ({
  NativeModulesProxy: {},
  requireNativeModule: jest.fn(),
}));

// 🔹 Aumento el tiempo máximo del test
// Lo hago porque a veces el emulador tarda un poco más en responder.
jest.setTimeout(30000);

// 🔹 Declaro una variable global para guardar el entorno del emulador
let testEnv;

// 🧩 1️⃣ Antes de todos los tests inicializo el entorno de Firestore emulado
// De esta forma trabajo con una base de datos falsa, sin tocar la real.
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "testing-rutacontrolapp",
    firestore: { host: "127.0.0.1", port: 8080 },
  });
});

// 🧩 2️⃣ Después de todos los tests limpio el entorno
// Esto sirve para cerrar conexiones y evitar el warning de “open handles”.
afterAll(async () => {
  await testEnv.cleanup();
});

// 🧩 3️⃣ Defino el test principal
test("muestra los viajes desde Firestore emulado", async () => {
  // Primero obtengo una referencia al Firestore local del emulador
  const db = testEnv.unauthenticatedContext().firestore();

  // Luego creo un viaje de prueba (mock) directamente en la colección “viajes”
  // Esto simula que ya tengo un registro cargado antes de renderizar el componente.
  const viajesRef = collection(db, "viajes");
  await setDoc(doc(viajesRef, "1"), {
    id: "1",
    origen: "Plaza Huincul",
    destino: "Neuquén",
    estado: "pendiente",
    fecha: "25-11-2025",
    kilometros: 120,
    choferEmail: "chofertest@gmail.com",
  });

  // Ahora renderizo el componente Viajes, pasándole el `db` del emulador
  // Así el componente lee los mismos datos que acabo de insertar.
  render(<Viajes db={db} />);

  // Finalmente espero a que se carguen los datos
  // y verifico que los textos aparezcan en pantalla.
  await waitFor(() => {
    expect(screen.getByText(/Plaza Huincul/i)).toBeTruthy();
    expect(screen.getByText(/Neuquén/i)).toBeTruthy();
    expect(screen.getByText(/pendiente/i)).toBeTruthy();
  });
});


