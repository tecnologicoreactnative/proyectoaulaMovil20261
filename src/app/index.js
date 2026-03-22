import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';

export default function LoginScreen() {
  const { user, loading, login, error, setError } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Redirect href="/(authenticated)/saludo" />;
  }

  const handleLogin = async (email, password) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      // Error ya manejado en AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de sesión</Text>
      <LoginForm
        onSubmit={handleLogin}
        loading={submitting}
        error={error}
      />
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    color: '#333',
  },
});
