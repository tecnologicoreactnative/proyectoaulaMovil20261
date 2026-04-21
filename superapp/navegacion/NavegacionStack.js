// NavegacionStack.js
import React, { useContext } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import MascotasScreen from '../screens/MascotasScreen';
import InicioScreen from '../screens/InicioScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { AuthContexto } from '../contextos/AuthContexto';
import SolicitudAdopcionScreen from '../screens/SolicitudAdopcionScreen';
import MisSolicitudesScreen from '../screens/MisSolicitudesScreen';

const Stack = createStackNavigator();

const NavegacionStack = () => {

  const { cerrarSesion, usuario } = useContext(AuthContexto);

  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: '#7A5C3A',
          elevation: 0,       // Android
          shadowOpacity: 0,   // iOS
        },
        headerTintColor: '#ff7a00',
      }}
    >
      <Stack.Screen
        name="Inicio"
        component={InicioScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../assets/icono.png')}
                style={{
                  width: 75,
                  height: 75,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                Inicio
              </Text>
            </View>
          ),


          headerRight: () =>
            usuario ? ( 
              <TouchableOpacity
                onPress={cerrarSesion}
                style={{
                  marginRight: 15,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#E8C9A0',
                  justifyContent: 'center',
                  alignItems: 'center',


                }}
              >
                <Ionicons
                  name="log-out-outline" 
                  size={22}
                  color="#fff"
                />
              </TouchableOpacity>
            ) : null,
        }}
      />

      <Stack.Screen
        name="Detalle"
        component={DetailsScreen}
        options={{
          title: 'Detalle',
        }}
      />

      
<Stack.Screen
  name="MisSolicitudes"
  component={MisSolicitudesScreen}
   options={{ headerShown: false }}
/>
      <Stack.Screen
  name="Mascotas"
  component={MascotasScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
  name="SolicitudAdopcion"
  component={SolicitudAdopcionScreen}
  options={{ headerShown: false }} // 👈 ESTA ES LA CLAVE
/>

    </Stack.Navigator>
  );
};

export default NavegacionStack;