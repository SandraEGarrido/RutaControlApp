/// ✅ Mock de expo-modules-core
// Evito que Jest intente ejecutar módulos nativos de Expo.

module.exports = {
  NativeUnimoduleProxy: {
    modulesConstants: {
      mockDefinition: {
        ExponentConstants: {
          experienceUrl: { mock: 'exp://localhost:8081' },
        },
      },
    },
  },
  requireNativeModule: jest.fn(),
};
