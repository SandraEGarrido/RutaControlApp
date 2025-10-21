import { Tabs, router } from 'expo-router';
import React, { useEffect } from 'react'; // ✅ importamos useEffect directamente

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

import { auth } from "@/firebase/config";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // 👇 useEffect runs after the component is mounted
  // 👇 useEffect se ejecuta después de que el componente se haya montado
  useEffect(() => {
    // Listen for authentication state changes (login/logout)
    // Escucha los cambios en el estado de autenticación (inicio o cierre de sesión)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // 🔹 Wait 500ms to ensure the layout is ready before navigating
      // 🔹 Espera 500ms para asegurar que el layout esté listo antes de navegar
      setTimeout(() => {
        if (!user) {
          router.replace("/login");
          // Redirects to the login screen if there is no authenticated user
          // Redirige a la pantalla de inicio de sesión si no hay usuario autenticado
        } else {
          // The user is signed in; you can store user.uid or continue normally
          // El usuario está autenticado; podés guardar el user.uid o continuar normalmente
          // const uid = user.uid;
        }
      }, 500);
    });

    // Clean up the listener when the component unmounts
    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []); // Empty dependency array → runs only once
  // Arreglo de dependencias vacío → se ejecuta solo una vez

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>

      {/* 
        Tabs.Screen for "Materias" - temporarily commented out
        Pestaña "Materias" - temporalmente comentada
      */}
      {/*<Tabs.Screen
        name="materias"
        options={{
          title: 'Materias',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'} // 👈 choose any Ionicons icon
              // 👈 elegí cualquier ícono de Ionicons
              size={28}
              color={color}
            />
          ),
        }}
      />*/}

      {/* 
        Tabs.Screen for "Inicio" 
        Pestaña "Inicio"
      */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* 
        Tabs.Screen for "Contacto" 
        Pestaña "Contacto"
      */}
      <Tabs.Screen
        name="contacto"
        options={{
          title: 'Contacto',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} // 👈 choose any Ionicons icon
              // 👈 elegí cualquier ícono de Ionicons
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cuenta"
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person-circle' : 'person-circle-outline'} // 👈 choose any Ionicons icon
              // 👈 elegí cualquier ícono de Ionicons
              size={28}
              color={color}
            />
          ),
        }}
      />

      
    </Tabs>
  );
}

