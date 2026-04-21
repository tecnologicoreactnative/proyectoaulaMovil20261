import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NavegacionTabs from './NavegacionTabs';
import DetailsScreen from '../Screens/DetailsScreen';

const Stack = createStackNavigator();

const NavegacionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Tabs" component={NavegacionTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Detalle" component={DetailsScreen} options={{ title: 'Detalle' }} /> 
    </Stack.Navigator>
  );
};

export default NavegacionStack; 