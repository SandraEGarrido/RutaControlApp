// ✅ jest.config.js
// Archivo de configuración de Jest para mi proyecto Expo/React Native
// En este archivo defino cómo se comportan los tests, qué librerías se transforman,
// y cómo manejar dependencias nativas como AsyncStorage.

module.exports = {
  // 🧩 1️⃣ Indico que voy a usar la configuración base de Expo
  // Esto adapta Jest para trabajar correctamente con React Native.
  preset: 'jest-expo',
  testEnvironment: 'jsdom',

  // 🧩 2️⃣ Especifico qué módulos deben ser transformados por Babel
  // y cuáles se deben ignorar. Esto evita errores con dependencias internas.
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|expo-modules-core|react-native|@react-native)/)',
  ],

  // 🧩 3️⃣ Indico que Jest debe ejecutar esta configuración
  // antes de cada test para extender las funciones de expect()
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],

  // 🧩 4️⃣ Le digo a Jest qué carpetas debe ignorar
  // así no busca tests en directorios de compilación o dependencias
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],

  // 🧩 5️⃣ Indico las extensiones de archivos que Jest puede entender
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // 🧩 6️⃣ Defino variables globales necesarias para React Native
  globals: {
    __DEV__: true, // Esta variable se usa para activar modo desarrollo
  },

  // 🧩 7️⃣ Agrego esta configuración para simular AsyncStorage en modo test
  // En los tests, Jest usa un mock del almacenamiento nativo
  // porque no hay un dispositivo físico disponible.
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '<rootDir>/node_modules/@react-native-async-storage/async-storage/jest/async-storage-mock.js',
  },

  // 🧩 8️⃣ Corrijo rutas y alias para evitar el error "import fuera del scope"
  // Esto indica a Jest que no debe intentar analizar archivos internos de Expo.
  modulePathIgnorePatterns: ['expo/src/winter'],

  // 🧩 9️⃣ Ajusto el directorio raíz para que Jest pueda resolver correctamente los imports
  // Así Jest entiende las rutas absolutas y evita errores de alias.
  rootDir: './',
  moduleDirectories: ['node_modules', '<rootDir>'],
};


