import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from 'react-native';

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native';

import { db, auth } from '../firebaseConfig';
import { styles } from '../styles/SolicitudAdopcionStyles';

const SolicitudAdopcionScreen = () => {
  const navigation = useNavigation();

  const [paso, setPaso] = useState(1);

  const [mascotas, setMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'mascotas'),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMascotas(data);
      }
    );

    return unsubscribe;
  }, []);

  const siguiente = () => setPaso(paso + 1);
  const atras = () => setPaso(paso - 1);

  const enviarSolicitud = async () => {
    if (!mascotaSeleccionada || !nombre || !telefono || !mensaje) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      const mascota = mascotas.find(m => m.id === mascotaSeleccionada);

      await addDoc(collection(db, 'solicitudes'), {
        mascotaId: mascota.id,
        mascotaNombre: mascota.nombre,
        solicitanteNombre: nombre,
        solicitanteTelefono: telefono,
        solicitanteMensaje: mensaje,
        userId: auth.currentUser.uid,
        estado: 'en revisión',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Éxito', 'Solicitud enviada');

      setPaso(1);
      setMascotaSeleccionada(null);
      setNombre('');
      setTelefono('');
      setMensaje('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1EA' }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../assets/icono.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Solicitud de adopción</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >

        {/* BOTÓN MIS SOLICITUDES */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('MisSolicitudes')}
        >
          <Text style={styles.secondaryButtonText}>
            Ver mis solicitudes
          </Text>
        </TouchableOpacity>

        {/* PASO 1 - SELECCIONAR MASCOTA */}
        {paso === 1 && (
          <View>
            <Text style={styles.selectorTitle}>Elige una mascota</Text>

            {mascotas.map((mascota) => (
              <TouchableOpacity
                key={mascota.id}
                style={[
                  styles.option,
                  mascotaSeleccionada === mascota.id && styles.optionSelected,
                ]}
                onPress={() => setMascotaSeleccionada(mascota.id)}
              >
                <Text
                  style={
                    mascotaSeleccionada === mascota.id
                      ? styles.optionTextSelected
                      : styles.optionText
                  }
                >
                  {mascota.nombre}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={siguiente}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PASO 2 - DATOS PERSONALES */}
        {paso === 2 && (
          <View>
            <TextInput
              placeholder="Tu nombre"
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
            />

            <TextInput
              placeholder="Teléfono"
              style={styles.input}
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="phone-pad"
            />

            <TouchableOpacity style={styles.button} onPress={siguiente}>
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>

            <Text onPress={atras} style={styles.backText}>
              ← Atrás
            </Text>
          </View>
        )}

        {/* PASO 3 - MENSAJE */}
        {paso === 3 && (
          <View>
            <TextInput
              placeholder="Mensaje"
              style={[styles.input, styles.textArea]}
              value={mensaje}
              onChangeText={setMensaje}
              multiline
            />

            <TouchableOpacity style={styles.button} onPress={enviarSolicitud}>
              <Text style={styles.buttonText}>Enviar 🚀</Text>
            </TouchableOpacity>

            <Text onPress={atras} style={styles.backText}>
              ← Atrás
            </Text>
          </View>
        )}

      </ScrollView>
      <TouchableOpacity
  style={styles.secondaryButton}
  onPress={() => navigation.navigate('Inicio')}
>
  <Text style={styles.secondaryButtonText}>
    Volver al inicio
  </Text>
</TouchableOpacity>
    </View>
  );
};

export default SolicitudAdopcionScreen;