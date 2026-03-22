import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import InicioScreen from '../Screens/InicioScreen';
import DetalleScreen from '../Screens/DetailsScreen';
import ListaEventos from '../Screens/ListaEventos';

const Stack = createStackNavigator();

const NavegacionStack = () => {
  return (
    <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Inicio" component={InicioScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="ListaEventos" component={ListaEventos} options={{ title: 'Próximos Eventos' }} />
      <Stack.Screen name="Detalle" component={DetalleScreen} options={{ title: 'Detalle' }} />
    </Stack.Navigator>
  );
};

export default NavegacionStack; 