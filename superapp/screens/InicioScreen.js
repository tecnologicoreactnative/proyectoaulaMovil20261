import React, { useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthContexto } from '../contextos/AuthContexto';
import { styles } from '../styles/InicioStyles';
import DragonGame from '../components/DragonGame';

const InicioScreen = () => {
  const { usuario } = useContext(AuthContexto);
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/fondo.png')}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, padding: 20 }}>
        {usuario && (
          <View style={[styles.card, { marginTop: 10 }]}> 

            {/* LOGO */}
            <Image
              source={require('../assets/huellas.png')}
              style={styles.logo}
            />

            {/* BIENVENIDA */}
            <Text style={styles.welcome}>
              Bienvenid@ {usuario.nombre} 👋
            </Text>

            <Text style={styles.Text}>
              Gracias por ayudar a cambiar la vida de una mascota.
            </Text>

            {/* BOTONES */}
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Mascotas')}
                style={styles.btnPrimary}
              >
                <Text style={styles.btnText}>Ver mascotas 🐶🐱</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Fundaciones')}
                style={styles.btnSecondary}
              >
                <Text style={styles.btnText}>Ver fundaciones 🏢</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('Historial')}
                style={styles.btnSecondary}
              >
                <Text style={styles.btnText}>Historial adopciones 📘</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SolicitudAdopcion')}
                style={styles.btnSecondary}
              >
                <Text style={styles.btnText}>Enviar solicitud 📝🐾</Text>
              </TouchableOpacity>
            </View>

            {/* JUEGO */}
            <DragonGame />

          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default InicioScreen;