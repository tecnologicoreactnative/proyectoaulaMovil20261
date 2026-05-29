import React, { useContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import NavegacionStack from './navegacion/NavegacionStack';
import AuthStack from './navegacion/AuthStack';
import { ProveedorAuth, AuthContexto } from './contextos/AuthContexto';
import BannerNotificaciones from './componentes/BannerNotificaciones';

const Rutas = () => {
  const { usuario } = useContext(AuthContexto);
  return usuario ? <NavegacionStack /> : <AuthStack />;
};

export default function App() {
  return (
    <ProveedorAuth>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <Rutas />
          <BannerNotificaciones />
        </View>
      </NavigationContainer>
    </ProveedorAuth>
  );
}
