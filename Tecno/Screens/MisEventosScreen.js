import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  Alert, Modal, TextInput, StyleSheet
} from 'react-native';
import {
  collection, query, where, getDocs, doc, getDoc,
  deleteDoc, updateDoc
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import styles from './styles/MisEventosStyles';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const MisEventosScreen = ({ navigation }) => {
  const [misEventos, setMisEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [escaneando, setEscaneando] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [inscripcionActiva, setInscripcionActiva] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [yaEscaneado, setYaEscaneado] = useState(false);

  const cargarMisEventos = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, 'inscripciones'), where('userId', '==', userId));
      const snapshot = await getDocs(q);

      const eventosPromesas = snapshot.docs.map(async (inscripcion) => {
        const datos = inscripcion.data();
        const eventoSnap = await getDoc(doc(db, 'eventos', datos.eventId));
        return {
          inscripcionId: inscripcion.id,
          eventId: datos.eventId,
          asistio: datos.asistio || false,
          ...eventoSnap.data()
        };
      });

      setMisEventos(await Promise.all(eventosPromesas));
    } catch (error) {
      console.error('Error al cargar mis eventos:', error);
    } finally {
      setCargando(false);
    }
  };

  const cancelarInscripcion = (inscripcionId, titulo, eventId, cuposDisponibles) => {
    Alert.alert(
      'Cancelar inscripción',
      `¿Estás seguro que deseas cancelar tu inscripción a "${titulo}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'inscripciones', inscripcionId));
              await updateDoc(doc(db, 'eventos', eventId), {
                cuposDisponibles: cuposDisponibles + 1
              });
              setMisEventos(prev => prev.filter(e => e.inscripcionId !== inscripcionId));
              Alert.alert('Listo', 'Tu inscripción fue cancelada.');
            } catch {
              Alert.alert('Error', 'No se pudo cancelar la inscripción.');
            }
          }
        }
      ]
    );
  };

  const abrirModalAsistencia = (item) => {
    setInscripcionActiva(item);
    setCodigoIngresado('');
    setYaEscaneado(false);
    setEscaneando(false);
    setModalVisible(true);
  };

  const abrirEscaner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para escanear el QR.');
        return;
      }
    }
    setYaEscaneado(false);
    setEscaneando(true);
  };

  const onCodigoEscaneado = ({ data }) => {
    if (yaEscaneado) return;
    setYaEscaneado(true);
    setEscaneando(false);
    setCodigoIngresado(data);
  };

  const confirmarAsistencia = async (codigoFinal) => {
    const codigo = codigoFinal || codigoIngresado;
    if (!inscripcionActiva) return;
    const codigoCorrecto = inscripcionActiva.codigoAsistencia;

    if (!codigoCorrecto) {
      Alert.alert('Sin código', 'Este evento no tiene código de asistencia configurado.');
      setModalVisible(false);
      return;
    }

    if (codigo.trim().toUpperCase() !== codigoCorrecto.toUpperCase()) {
      Alert.alert('Código incorrecto', 'El código ingresado no es válido.');
      setYaEscaneado(false);
      return;
    }

    try {
      await updateDoc(doc(db, 'inscripciones', inscripcionActiva.inscripcionId), { asistio: true });
      setMisEventos(prev =>
        prev.map(e =>
          e.inscripcionId === inscripcionActiva.inscripcionId ? { ...e, asistio: true } : e
        )
      );
      setModalVisible(false);
      Alert.alert('¡Asistencia registrada!', `Tu asistencia a "${inscripcionActiva.titulo}" fue confirmada.`);
    } catch {
      Alert.alert('Error', 'No se pudo registrar la asistencia.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarMisEventos();
    }, [])
  );

  if (cargando) return <ActivityIndicator size="large" color="#4A90E2" style={{ flex: 1 }} />;

  const eventosFiltrados = misEventos.filter(e => {
    if (filtro === 'inscritos') return !e.asistio;
    if (filtro === 'asistidos') return e.asistio;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Eventos</Text>

      <View style={styles.filtros}>
        {[['todos', 'Todos'], ['inscritos', 'Inscritos'], ['asistidos', 'Asistidos']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={filtro === key ? styles.filtroBtonActivo : styles.filtroBton}
            onPress={() => setFiltro(key)}
          >
            <Text style={filtro === key ? styles.filtroTextoActivo : styles.filtroTexto}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.contadorTexto}>
        {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} — {misEventos.filter(e => e.asistio).length} asistido{misEventos.filter(e => e.asistio).length !== 1 ? 's' : ''}
      </Text>

      {eventosFiltrados.length === 0 ? (
        <Text style={styles.vacio}>
          {filtro === 'asistidos' ? 'Aún no tienes asistencias registradas.' :
           filtro === 'inscritos' ? 'No tienes eventos pendientes.' :
           'No estás inscrito en ningún evento.'}
        </Text>
      ) : (
        <FlatList
          data={eventosFiltrados}
          keyExtractor={(item) => item.inscripcionId}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <TouchableOpacity onPress={() => navigation.navigate('Detalle', { eventoId: item.eventId })}>
                <View style={styles.headerTarjeta}>
                  <Text style={styles.nombreEvento}>{item.titulo}</Text>
                  <View style={item.asistio ? styles.badgeAsistio : styles.badgeInscrito}>
                    <Text style={styles.badgeTexto}>{item.asistio ? 'Asistió' : 'Inscrito'}</Text>
                  </View>
                </View>
                <Text style={styles.infoEvento}>📍 {item.lugar}</Text>
                <Text style={styles.infoEvento}>🕐 {item.Hora || item.hora}</Text>
              </TouchableOpacity>

              {!item.asistio && (
                <TouchableOpacity
                  style={styles.botonAsistencia}
                  onPress={() => abrirModalAsistencia(item)}
                >
                  <Text style={styles.botonAsistenciaTexto}>Registrar asistencia</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={() => cancelarInscripcion(item.inscripcionId, item.titulo, item.eventId, item.cuposDisponibles)}
              >
                <Text style={styles.botonCancelarTexto}>Cancelar inscripción</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de asistencia */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modalCaja}>
            {escaneando ? (
              <View style={estilosScanner.scannerContainer}>
                <Text style={estilosScanner.scannerTitulo}>Apunta al código QR del evento</Text>
                <CameraView
                  style={estilosScanner.camara}
                  facing="back"
                  onBarcodeScanned={onCodigoEscaneado}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />
                <TouchableOpacity style={estilosScanner.btnCancelar} onPress={() => setEscaneando(false)}>
                  <Text style={styles.botonCancelarTexto}>Cancelar escaneo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitulo}>Registrar asistencia</Text>
                <Text style={styles.modalSubtitulo}>{inscripcionActiva?.titulo}</Text>

                <TouchableOpacity style={styles.botonAsistencia} onPress={abrirEscaner}>
                  <Text style={styles.botonAsistenciaTexto}>Escanear QR</Text>
                </TouchableOpacity>

                <Text style={estilosScanner.oTexto}>— o ingresa el código manualmente —</Text>

                <TextInput
                  style={styles.modalInput}
                  placeholder="Código del evento"
                  placeholderTextColor="#999"
                  value={codigoIngresado}
                  onChangeText={setCodigoIngresado}
                  autoCapitalize="characters"
                />
                <TouchableOpacity style={styles.modalBotonConfirmar} onPress={() => confirmarAsistencia()}>
                  <Text style={styles.botonAsistenciaTexto}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelar}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const estilosScanner = StyleSheet.create({
  scannerContainer: { width: '100%', alignItems: 'center' },
  scannerTitulo: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 12, textAlign: 'center' },
  camara: { width: '100%', height: 280, borderRadius: 12, overflow: 'hidden' },
  btnCancelar: { marginTop: 12, backgroundColor: '#ffe5e5', padding: 10, borderRadius: 8, alignItems: 'center', width: '100%' },
  oTexto: { fontSize: 12, color: '#999', marginVertical: 12, textAlign: 'center' },
});

export default MisEventosScreen;
