import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InicioScreen from '../Screens/InicioScreen';
import MisEventosScreen from '../Screens/MisEventosScreen';
import ConfigScreen from '../Screens/ConfigScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const NavegacionTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icono;
          if (route.name === 'Inicio') {
            icono = 'home';
          } else if (route.name === 'MisEventos') {
            icono = 'calendar';
          } else if (route.name === 'Configuracion') {
            icono = 'settings';
          }
          return <Ionicons name={icono} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="MisEventos" component={MisEventosScreen} options={{ title: 'Mis Eventos' }} />
      <Tab.Screen name="Configuracion" component={ConfigScreen} options={{ title: 'Configuración' }} />
    </Tab.Navigator>
  );
};

export default NavegacionTabs; 