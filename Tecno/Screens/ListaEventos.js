import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 


const ListaEventos = ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'eventos'));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEventos(lista);
      } catch (error) {
        console.error("Error al cargar:", error);
      } finally {
        setCargando(false);
      }
    };
    cargarEventos();
  }, []);

  if (cargando) {
    return <ActivityIndicator size="large" color="#4A90E2" style={styles.centrado} />;
  }

  return (
    <View style={styles.fondo}>
      <Text style={styles.encabezado}>Próximos Eventos</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.tarjeta}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Detalle', { eventoId: item.id })} 
          >
            <Text style={styles.titulo}>{item.titulo}</Text>
            <View style={styles.filaInfo}>
              <Text style={styles.textoInfo}>📅 {item.Hora}</Text>
              <Text style={styles.textoInfo}>📍 {item.Lugar}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#F4F6F9', paddingHorizontal: 20, paddingTop: 20 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  encabezado: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  tarjeta: { 
    backgroundColor: '#FFFFFF', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4
  },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 10 },
  filaInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  textoInfo: { fontSize: 14, color: '#7F8C8D', fontWeight: '500' }
});

export default ListaEventos;