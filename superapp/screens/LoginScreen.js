import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, KeyboardAvoidingView, ScrollView,
  Animated, ImageBackground, Image, Platform
} from 'react-native';

import { AuthContexto } from '../contextos/AuthContexto';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { styles } from '../styles/LoginStyles';
import { components } from '../styles/components';

const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const { iniciarSesion } = useContext(AuthContexto);

  // 👉 referencia pa brincar entre inputs
  const passwordRef = useRef();

  // 🎬 animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  // 🔥 LOGIN
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
//¿qué datos exactamente le estás pasando a iniciarSesion?
        iniciarSesion({
          nombre: user.displayName || 'Usuario',
        });
      })
      .catch(error => Alert.alert('Error', error.message));
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

          {/* 🔥 HEADER */}
          <View style={styles.header}>
            <Image
              source={require('../assets/icono.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Bienvenid@</Text>
            <Text style={styles.subtitle}>Iniciá sesión</Text>
          </View>

          {/* 🔥 FORM */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY }],
            }}
          >
            <View style={styles.form}>

              {/* 📧 EMAIL */}
              <Text style={styles.label}>Correo</Text>
              <TextInput
                placeholder="tu@correo.com"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={[
                  components.input,
                  emailFocused && components.inputFocused
                ]}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current.focus()}
              />

              {/* 🔒 PASSWORD */}
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                ref={passwordRef}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                style={[
                  components.input,
                  passFocused && components.inputFocused
                ]}
                returnKeyType="done"
                onSubmitEditing={handleLogin} // 👈 ENTER hace login
              />

              {/* 🔥 BOTÓN */}
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={components.buttonPrimary}
                  onPress={handleLogin}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Text style={components.buttonText}>Ingresar</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* 🔗 REGISTRO */}
              <TouchableOpacity
                style={components.buttonSecondary}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={components.buttonSecondaryText}>
                  ¿No tenés cuenta? Registrate
                </Text>
              </TouchableOpacity>

            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;