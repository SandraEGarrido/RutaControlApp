// ✅ Mock preventivo para evitar errores en jest-expo (mockDefinition)
// En primera persona: con este archivo me aseguro de que Jest
// cargue estos mocks ANTES que el preset de Expo.

// Simulo el paquete "expo"
jest.mock("expo", () => ({}));

// Simulo el paquete "expo-modules-core"
jest.mock("expo-modules-core", () => ({
  NativeUnimoduleProxy: { modulesConstants: {} },
  requireNativeModule: jest.fn(),
}));
// Este archivo se ejecuta antes de mis tests
// y sirve para definir variables globales o mocks necesarios.

// Simulo la función setImmediate para Firestore y gRPC
global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0));