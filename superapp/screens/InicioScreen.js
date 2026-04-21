import React, { useContext, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  ImageBackground,
  PanResponder,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { AuthContexto } from '../contextos/AuthContexto';
import { styles } from '../styles/InicioStyles';
import { components } from '../styles/components';
import { colors } from '../styles/colors';

const { height } = Dimensions.get('window');
const SEGMENTS = 15;

const InicioScreen = () => {
  const { usuario } = useContext(AuthContexto);
  const navigation = useNavigation();

  // 🐉 Dragón en fila (visible desde inicio)
  const points = useRef(
    Array.from({ length: SEGMENTS }, (_, i) =>
      new Animated.ValueXY({ x: 100 - i * 12, y: 80 })
    )
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        const x = gesture.moveX - 40;
        const y = gesture.moveY - 180;

        // 🐲 cabeza con animación suave
        Animated.spring(points[0], {
          toValue: { x, y },
          useNativeDriver: false,
          speed: 20,
          bounciness: 0,
        }).start();

        // 🐍 cuerpo sigue con efecto “cola”
        for (let i = 1; i < SEGMENTS; i++) {
          const prevX = points[i - 1].x._value;
          const prevY = points[i - 1].y._value;

          Animated.spring(points[i], {
            toValue: { x: prevX, y: prevY },
            useNativeDriver: false,
            speed: 20,
            bounciness: 0,
          }).start();
        }
      },

      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
    <ImageBackground
      source={require('../assets/fondo.png')}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        
        <View
          style={[
            components.card,
            {
              minHeight: height * 0.65,
              justifyContent: 'space-between',
            },
          ]}
        >
          {usuario && (
            <>
              <Image
                source={require('../assets/huellas.png')}
                style={{
                  width: 80,
                  height: 80,
                  alignSelf: 'center',
                  marginBottom: 3,
                  resizeMode: 'contain',
                }}
              />

              <Text style={styles.welcome}>
                Bienvenid@ {usuario.nombre}
              </Text>

              <Text style={styles.Text}>
                Gracias por ayudar a cambiar la vida de una mascota.
              </Text>

              {/* BOTONES */}
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Mascotas')}
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.primary,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Ver mascotas 🐶🐱
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('SolicitudAdopcion')}
                  style={{
                    marginTop: 10,
                    backgroundColor: colors.primaryDark,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Enviar solicitud 📝🐾
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 🐉 JUEGO */}
              <View
                {...panResponder.panHandlers}
                style={{
                  marginTop: 20,
                  height: 180,
                  backgroundColor: '#222',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                {points.map((point, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      position: 'absolute',
                      width: index === 0 ? 18 : 10,
                      height: index === 0 ? 18 : 10,
                      borderRadius: 50,
                      backgroundColor:
                        index === 0 ? '#ff3b3b' : '#ffffff',
                      transform: point.getTranslateTransform(),
                    }}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

export default InicioScreen;