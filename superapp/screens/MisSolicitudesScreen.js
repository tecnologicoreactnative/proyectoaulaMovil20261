import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db, auth } from '../firebaseConfig';
import { styles } from '../styles/SolicitudAdopcionStyles';

const MisSolicitudesScreen = () => {
  const navigation = useNavigation();

  const [solicitudes, setSolicitudes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [mascotaFiltro, setMascotaFiltro] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'solicitudes'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSolicitudes(data);
    });

    return unsubscribe;
  }, []);

  // Mascotas únicas para el filtro
  const mascotasUnicas = [...new Set(
    solicitudes.map(s => s.mascotaNombre)
  )];

  // Aplicar filtros
  const solicitudesFiltradas = solicitudes.filter(s =>
    (estadoFiltro === '' || s.estado === estadoFiltro) &&
    (mascotaFiltro === '' || s.mascotaNombre === mascotaFiltro)
  );

  // Cancelar solicitud
  const cancelarSolicitud = (id) => {
    Alert.alert(
      'Cancelar solicitud',
      '¿Seguro que deseas cancelar esta solicitud?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            await updateDoc(doc(db, 'solicitudes', id), {
              estado: 'cancelada',
            });
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1EA' }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require('../assets/icono.png')}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>
          Mis solicitudes
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>

        {/* BOTÓN REGRESAR A ENVIAR SOLICITUD */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SolicitudAdopcion')}
        >
          <Text style={styles.secondaryButtonText}>
            Enviar nueva solicitud
          </Text>
        </TouchableOpacity>

        {/* FILTRO POR ESTADO */}
        <View style={styles.input}>
          <Picker
            selectedValue={estadoFiltro}
            onValueChange={setEstadoFiltro}
          >
            <Picker.Item label="Filtrar por estado" value="" />
            <Picker.Item label="En revisión" value="en revisión" />
            <Picker.Item label="Aprobada" value="aprobada" />
            <Picker.Item label="Rechazada" value="rechazada" />
            <Picker.Item label="Cancelada" value="cancelada" />
          </Picker>
        </View>

        {/* FILTRO POR MASCOTA */}
        <View style={styles.input}>
          <Picker
            selectedValue={mascotaFiltro}
            onValueChange={setMascotaFiltro}
          >
            <Picker.Item label="Filtrar por mascota" value="" />
            {mascotasUnicas.map((nombre, index) => (
              <Picker.Item
                key={index}
                label={nombre}
                value={nombre}
              />
            ))}
          </Picker>
        </View>

        {/* LISTA DE SOLICITUDES */}
        {solicitudesFiltradas.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No hay solicitudes
          </Text>
        )}

        {solicitudesFiltradas.map((s) => (
          <View key={s.id} style={styles.option}>

            <Text style={styles.optionText}>
              🐾 Mascota: {s.mascotaNombre}
            </Text>

            <Text style={styles.optionText}>
              📌 Estado: {s.estado}
            </Text>

            <Text style={styles.optionText}>
              📞 Teléfono: {s.solicitanteTelefono}
            </Text>

            <Text style={styles.optionText}>
              📝 Mensaje:
            </Text>

            <Text style={{ marginTop: 4, color: '#555' }}>
              {s.solicitanteMensaje}
            </Text>

            {/* BOTÓN CANCELAR */}
            {s.estado !== 'cancelada' && (
              <TouchableOpacity
                style={[styles.secondaryButton, { marginTop: 10 }]}
                onPress={() => cancelarSolicitud(s.id)}
              >
                <Text style={styles.secondaryButtonText}>
                  Cancelar solicitud
                </Text>
              </TouchableOpacity>
            )}

          </View>
        ))}

      </ScrollView>
    </View>
  );
};

export default MisSolicitudesScreen;