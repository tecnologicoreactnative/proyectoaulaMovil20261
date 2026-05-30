// App.js
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import NavegacionStack from './navegacion/NavegacionStack'; // Flujo

import AuthStack from './navegacion/AuthStack'; // Flujo de autenticación
import { ProveedorAuth, AuthContexto } from './contextos/AuthContexto';

//¿Qué pasa exactamente cuando el usuario cierra sesión?

// Este componente decide QUÉ pantallas mostrar según si hay usuario o no
const Rutas = () => {
  
  // Saca el usuario del contexto global (AuthContexto)
  // Si alguien llamó iniciarSesion() → usuario tiene datos
  // Si alguien llamó cerrarSesion() → usuario es null
  const { usuario } = useContext(AuthContexto);

  // TERNARIO: si hay usuario → muestra app principal
  //           si NO hay usuario → muestra flujo de login
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
