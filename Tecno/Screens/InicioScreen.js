import React, { useState, useCallback, useEffect } from 'react'; 
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { AuthContexto } from '../contextos/AuthContexto';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { useContext } from 'react';
import styles from './styles/InicioStyles';

const InicioScreen = ({ navigation }) => {
  const { usuario, cerrarSesion } = useContext(AuthContexto);
  const [eventos, setEventos] = useState([]);
  const [eventosFiltrados, setEventosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState(''); 

  const cargarEventos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'eventos'));
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEventos(lista);
      setEventosFiltrados(lista);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarEventos();
    }, [])
  );

  useEffect(() => {
  const resultado = eventos.filter(evento =>
    evento.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );
  setEventosFiltrados(resultado);
}, [busqueda, eventos]); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bienvenido}>¡Bienvenid@! 😊</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      <Text style={styles.subtitulo}>Próximos Eventos</Text>

      <TextInput
        style={styles.input}
        placeholder="🔍 Buscar por nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#888"
      /> 

      {cargando ? (
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />
      ) : eventosFiltrados.length === 0 ? (
        <Text style={styles.vacio}>No se encontraron eventos.</Text>
      ) : (
        <FlatList
          data={eventosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tarjeta}
              onPress={() => navigation.navigate('Detalle', { eventoId: item.id })}
            >
              <Text style={styles.tituloEvento}>{item.titulo}</Text>
              <Text style={styles.infoEvento}>📅 {item.Hora}</Text>
              <Text style={styles.infoEvento}>📍 {item.lugar}</Text>
              <Text style={styles.infoEvento}>
                {item.cuposDisponibles > 0 ? `✅ ${item.cuposDisponibles} cupos` : '🔴 Sin cupos'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar Sesión 🔒</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InicioScreen; 