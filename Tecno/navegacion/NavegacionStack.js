import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavegacionTabs from './NavegacionTabs';
import DetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator();

const NavegacionStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tabs" component={NavegacionTabs} options={{ headerShown: false }} />
      <Stack.Screen 
        name="Detalle" 
        component={DetailsScreen} 
        options={{ 
          title: 'Detalle',
          headerTintColor: '#000000',
          headerStyle: { backgroundColor: '#ffffff' },
        }} 
      />
    </Stack.Navigator>
  );
};

export default NavegacionStack; 