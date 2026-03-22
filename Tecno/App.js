import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NavegacionStack from './navegacion/NavegacionStack'; 
import AuthStack from './navegacion/AuthStack'; 
import { ProveedorAuth, AuthContexto } from './contextos/AuthContexto';

const Rutas = () => {
 const { usuario } = useContext(AuthContexto);
 return usuario ? <NavegacionStack /> : <AuthStack />; 
};

export default function App() {
 return (
 <ProveedorAuth>
 <NavigationContainer>
 <Rutas />
 </NavigationContainer>
 </ProveedorAuth>
 );
}
