import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  ImageBackground,
  Image,
  Platform,
} from 'react-native';

import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { styles } from '../styles/RegisterStyles';
import { components } from '../styles/components';

export default function RegisterScreen({ navigation }) {

  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NUEVO
  const [tipoUsuario, setTipoUsuario] = useState('usuario_general');
  const [nombreFundacion, setNombreFundacion] = useState('');

  const [userFocused, setUserFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleSignUp = async () => {

    if (!usuario || !email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    // VALIDACIÓN FUNDACIÓN
    if (
      tipoUsuario === 'fundacion' &&
      !nombreFundacion
    ) {
      Alert.alert(
        'Error',
        'Ingresá el nombre de la fundación'
      );
      return;
    }

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: usuario,
      });

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        usuario: usuario,
        email: email,

        // NUEVO
        tipo_usuario: tipoUsuario,
        nombre_fundacion:
          tipoUsuario === 'fundacion'
            ? nombreFundacion
            : '',

        createdAt: new Date(),
      });

      Alert.alert(
        '✅ Registro exitoso',
        'Usuario creado correctamente 🐾'
      );

      navigation.navigate('Login');

    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/fondo.png')}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, {
            flexGrow: 1,
            justifyContent: 'flex-start',
            paddingTop: 40,
            paddingBottom: 40,
          }]}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >

          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('../assets/icono.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>
              Crear cuenta
            </Text>

            <Text style={styles.subtitle}>
              Registrate
            </Text>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >

            <View style={styles.form}>

              {/* Usuario */}
              <Text style={styles.label}>
                Usuario
              </Text>

              <TextInput
                placeholder="Tu nombre"
                value={usuario}
                onChangeText={setUsuario}
                onFocus={() => setUserFocused(true)}
                onBlur={() => setUserFocused(false)}
                style={[
                  components.input,
                  userFocused &&
                    components.inputFocused,
                ]}
              />

              {/* TIPO USUARIO */}
              <Text style={styles.label}>
                Tipo de cuenta
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginBottom: 15,
                }}
              >

                <TouchableOpacity
                  onPress={() =>
                    setTipoUsuario(
                      'usuario_general'
                    )
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor:
                      tipoUsuario ===
                      'usuario_general'
                        ? '#ff6b81'
                        : '#ddd',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color:
                        tipoUsuario ===
                        'usuario_general'
                          ? '#fff'
                          : '#000',
                      fontWeight: 'bold',
                    }}
                  >
                    Usuario General
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setTipoUsuario('fundacion')
                  }
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor:
                      tipoUsuario ===
                      'fundacion'
                        ? '#ff6b81'
                        : '#ddd',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color:
                        tipoUsuario ===
                        'fundacion'
                          ? '#fff'
                          : '#000',
                      fontWeight: 'bold',
                    }}
                  >
                    Fundación
                  </Text>
                </TouchableOpacity>

              </View>

              {/* CAMPO FUNDACIÓN */}
              {tipoUsuario === 'fundacion' && (
                <>
                  <Text style={styles.label}>
                    Nombre de la Fundación
                  </Text>

                  <TextInput
                    placeholder="Fundación Esperanza"
                    value={nombreFundacion}
                    onChangeText={
                      setNombreFundacion
                    }
                    style={components.input}
                  />
                </>
              )}

              {/* Email */}
              <Text style={styles.label}>
                Correo
              </Text>

              <TextInput
                placeholder="tu@correo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={[
                  components.input,
                  emailFocused &&
                    components.inputFocused,
                ]}
              />

              {/* Password */}
              <Text style={styles.label}>
                Contraseña
              </Text>

              <TextInput
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                style={[
                  components.input,
                  passFocused &&
                    components.inputFocused,
                ]}
              />

              {/* Botón */}
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnim }],
                }}
              >
                <TouchableOpacity
                  style={components.buttonPrimary}
                  onPress={handleSignUp}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Text style={components.buttonText}>
                    Registrarse
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Login */}
              <TouchableOpacity
                style={components.buttonSecondary}
                onPress={() =>
                  navigation.navigate('Login')
                }
              >
                <Text
                  style={
                    components.buttonSecondaryText
                  }
                >
                  ¿Ya tenés cuenta? Iniciá sesión
                </Text>
              </TouchableOpacity>

            </View>

          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}