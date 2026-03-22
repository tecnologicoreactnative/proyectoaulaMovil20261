import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function SaludoScreen() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  const displayName = user.email || user.displayName || 'Usuario';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola, {displayName}!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente.</Text>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#d32f2f',
    padding: 14,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
