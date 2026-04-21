import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebaseConfig';
import { styles } from '../styles/MascotasStyles';

const MascotasScreen = () => {
  const navigation = useNavigation();

  const [mascotas, setMascotas] = useState([]);

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [foto, setFoto] = useState('');

  const [filtroMascota, setFiltroMascota] = useState('');
  const [filtroUbicacion, setFiltroUbicacion] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'mascotas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMascotas(data);
    });

    return unsubscribe;
  }, []);

  const guardarMascota = async () => {
    if (!nombre || !edad || !ubicacion || !foto) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'mascotas'), {
        nombre,
        edad,
        ubicacion,
        foto,
        createdAt: serverTimestamp(),
      });

      setNombre('');
      setEdad('');
      setUbicacion('');
      setFoto('');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la mascota');
    }
  };

  // valores únicos para filtros
  const nombresUnicos = [...new Set(mascotas.map(m => m.nombre))];
  const ubicacionesUnicas = [...new Set(mascotas.map(m => m.ubicacion))];

  const mascotasFiltradas = mascotas.filter(m =>
    (filtroMascota === '' || m.nombre === filtroMascota) &&
    (filtroUbicacion === '' || m.ubicacion === filtroUbicacion)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F1EA' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={[styles.header, { marginTop: 10 }]}>
          <Image source={require('../assets/icono.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Mascotas en adopción</Text>
        </View>

        {/* BOTÓN INICIO */}
        <TouchableOpacity
          style={styles.inicioButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.inicioButtonText}>
            Volver al inicio
          </Text>
        </TouchableOpacity>

        {/* 🔎 FILTROS DESPLEGABLES */}
        <View style={styles.form}>
          <Text style={styles.title}>Filtrar mascotas</Text>

          <View style={styles.input}>
            <Picker
              selectedValue={filtroMascota}
              onValueChange={setFiltroMascota}
            >
              <Picker.Item label="Filtrar por mascota" value="" />
              {nombresUnicos.map((n, i) => (
                <Picker.Item key={i} label={n} value={n} />
              ))}
            </Picker>
          </View>

          <View style={styles.input}>
            <Picker
              selectedValue={filtroUbicacion}
              onValueChange={setFiltroUbicacion}
            >
              <Picker.Item label="Filtrar por ubicación" value="" />
              {ubicacionesUnicas.map((u, i) => (
                <Picker.Item key={i} label={u} value={u} />
              ))}
            </Picker>
          </View>
        </View>

        {/* FORMULARIO */}
        <View style={styles.form}>
          <Text style={styles.title}>Agregar mascota</Text>

          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <TextInput
            placeholder="Edad"
            style={styles.input}
            value={edad}
            onChangeText={setEdad}
          />

          <TextInput
            placeholder="Ubicación"
            style={styles.input}
            value={ubicacion}
            onChangeText={setUbicacion}
          />

          <TextInput
            placeholder="URL de la foto"
            style={styles.input}
            value={foto}
            onChangeText={setFoto}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={guardarMascota}
          >
            <Text style={styles.buttonText}>Guardar mascota</Text>
          </TouchableOpacity>
        </View>

        {/* LISTADO */}
        {mascotasFiltradas.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.foto }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.text}>Edad: {item.edad}</Text>
              <Text style={styles.text}>📍 {item.ubicacion}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default MascotasScreen;