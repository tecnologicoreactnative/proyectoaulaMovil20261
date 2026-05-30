import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import InicioScreen from '../screens/InicioScreen';
import MisEventosScreen from '../screens/MisEventosScreen';
import AdminScreen from '../screens/AdminScreen';
import { Ionicons } from '@expo/vector-icons';
import { AuthContexto } from '../contextos/AuthContexto';

const Tab = createBottomTabNavigator();

const NavegacionTabs = () => {
  const { rol } = useContext(AuthContexto);

  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icono;
          if (route.name === 'Inicio') icono = 'home';
          else if (route.name === 'MisEventos') icono = 'calendar';
          else if (route.name === 'Admin') icono = 'construct';
          return <Ionicons name={icono} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="MisEventos" component={MisEventosScreen} options={{ title: 'Mis Eventos' }} />
      {rol === 'organizador' && (
        <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }} />
      )}
    </Tab.Navigator>
  );
};

export default NavegacionTabs; 