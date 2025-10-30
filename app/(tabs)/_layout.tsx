// 📦 Importamos las herramientas principales de Expo Router y React
import { Tabs, router } from 'expo-router';   // 'Tabs' define las pestañas inferiores; 'router' sirve para navegar entre pantallas
import React, { useEffect } from 'react';     // Importamos React y el hook useEffect

// 🎨 Librería de íconos (Ionicons) para las pestañas
import { Ionicons } from '@expo/vector-icons';

// 💫 Importamos componentes personalizados del proyecto
import { HapticTab } from '@/components/haptic-tab';  // botón táctil con vibración
import { Colors } from '@/constants/theme';            // archivo que guarda colores globales
import { useColorScheme } from '@/hooks/use-color-scheme'; // detecta si el sistema está en modo claro u oscuro

// 🔐 Importamos la configuración de autenticación de Firebase
import { auth } from "@/firebase/config";


// 🚀 Componente principal del layout de pestañas
export default function TabLayout() {

  // Detecta si el usuario está usando modo oscuro o claro
  // Detect whether user prefers dark or light mode
  const colorScheme = useColorScheme();


  // 🧠 useEffect: ejecuta código automáticamente al montar el componente
  useEffect(() => {

    // Escucha si el usuario inicia o cierra sesión
    // Listen for authentication state changes (login / logout)
    const unsubscribe = auth.onAuthStateChanged((user) => {

      // Espera 500ms para dar tiempo a que el layout cargue antes de navegar
      // Wait 500ms before navigating to ensure layout is ready
      setTimeout(() => {

        // Si no hay usuario autenticado, redirige al login
        // If user is not logged in, redirect to the login screen
        if (!user) {
          router.replace("/login");   // Reemplaza la pantalla actual por "login"
        }

        // Si hay usuario, continúa normalmente dentro de las tabs
        // If logged in, stay on the current tabs view
      }, 500);
    });

    // 🔄 Limpia el listener cuando el componente se desmonta (buena práctica)
    // Cleanup function when component unmounts
    return () => unsubscribe();

  }, []); // [] → ejecuta este efecto solo una vez, al cargar el layout
  // runs only once when the component mounts


  // 🧭 Definición del layout con tres pestañas (Tabs)
  return (
    <Tabs
      screenOptions={{
        // 🎨 Colores de los íconos activos e inactivos
        tabBarActiveTintColor: '#FF6F61',  // coral: tu color principal
        tabBarInactiveTintColor: '#777',   // gris para las pestañas inactivas

        // 🎨 Estilo visual de la barra inferior
        tabBarStyle: { backgroundColor: '#f5f5f5' },  // gris claro

        // 🚫 Oculta los headers (títulos arriba)
        headerShown: false,

        // 💫 Añade efecto háptico (vibración ligera) al presionar tabs
        tabBarButton: HapticTab,
      }}>


      {/* 🚚 TAB 1: VIAJES */}
      {/* Representa la pantalla principal con los viajes de los choferes */}
      <Tabs.Screen
        name="viajes"  // 🔗 Nombre del archivo en app/(tabs)/viajes.tsx
        options={{
          title: 'Viajes',  // Nombre visible en la barra
          tabBarIcon: ({ color, focused }) => (
            // Ícono que cambia según si está activa o no la pestaña
            <Ionicons name={focused ? 'map' : 'map-outline'} size={26} color={color} />
          ),
        }}
      />


      {/* 👷‍♂️ TAB 2: CHOFERES */}
      {/* Muestra información o gestión de choferes */}
      <Tabs.Screen
        name="choferes" // 🔗 Nombre del archivo en app/(tabs)/choferes.tsx
        options={{
          title: 'Choferes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'id-card' : 'id-card-outline'} size={26} color={color} />
          ),
        }}
      />


      {/* ⚙️ TAB 3: CUENTA */}
      {/* Muestra el perfil o cuenta del usuario logueado */}
      <Tabs.Screen
        name="cuenta" // 🔗 Nombre del archivo en app/(tabs)/cuenta.tsx
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

