// ✅ jest.config.js
// Reemplacé el preset de Expo por una configuración directa
// de React Native, para evitar el bug de "mockDefinition" en jest-expo.

module.exports = {
  preset: 'react-native', // 👈 reemplazo seguro de jest-expo
  testEnvironment: 'jsdom',

  // ✅ Transformo los módulos de React Native y Firebase con Babel
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|firebase|@firebase)/)',
  ],

  // ✅ Extiendo expect() con las funciones de testing-library
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // ✅ Ignoro rutas que no tienen tests
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  // ✅ Extensiones reconocidas
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // ✅ Variables globales necesarias para React Native
  globals: {
    __DEV__: true,
  },

  // ✅ Mapeo de módulos para mocks
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js',
    '^app/(.*)$': '<rootDir>/app/$1',
  },

  // ✅ Directorios base
  rootDir: './',
  moduleDirectories: ['node_modules', '<rootDir>'],

  // ✅ Mock automático de expo-modules-core
  setupFiles: ['<rootDir>/__mocks__/expo-modules-core.js'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  setupFiles: ['<rootDir>/jest.setup.js'],

};



