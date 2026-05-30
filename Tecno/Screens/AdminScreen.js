import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, Alert, ScrollView, StyleSheet, Modal
} from 'react-native';
import { db } from '../firebaseConfig';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, Timestamp
} from 'firebase/firestore';
import QRCode from 'react-native-qrcode-svg';

export default function AdminScreen() {
  const [eventos, setEventos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(campoVacio());
  const [eventoQR, setEventoQR] = useState(null);
  const [eventoOriginal, setEventoOriginal] = useState(null);

  function campoVacio() {
    return { titulo: '', organizador: '', lugar: '', fecha: '', hora: '', cuposDisponibles: '', descripcion: '' };
  }

  function generarCodigo() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  const cargarEventos = async () => {
    const snap = await getDocs(collection(db, 'eventos'));
    setEventos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { cargarEventos(); }, []);

  const guardar = async () => {
    const { titulo, organizador, lugar, fecha, hora, cuposDisponibles, descripcion } = form;
    if (!titulo || !fecha || !hora || !lugar) {
      Alert.alert('Campos requeridos', 'Título, fecha, hora y lugar son obligatorios.');
      return;
    }
    const cupos = parseInt(cuposDisponibles) || 0;
    const datos = { titulo, organizador, lugar, fecha, Hora: hora, hora, cuposDisponibles: cupos, descripcion };

    try {
      if (editando) {
        await updateDoc(doc(db, 'eventos', editando), datos);
        const cambios = [];
        if (eventoOriginal) {
          const horaAnterior = eventoOriginal.Hora || eventoOriginal.hora || '';
          if (hora !== horaAnterior) cambios.push(`hora cambia a ${hora}`);
          if (lugar !== (eventoOriginal.lugar || '')) cambios.push(`lugar cambia a ${lugar}`);
        }
        if (cambios.length > 0) {
          await addDoc(collection(db, 'notificaciones'), {
            eventId: editando,
            titulo: `Actualización: ${titulo}`,
            mensaje: cambios.join(' · '),
            fecha: Timestamp.now(),
          });
        }
        Alert.alert('Listo', 'Evento actualizado correctamente.');
      } else {
        await addDoc(collection(db, 'eventos'), { ...datos, fechaCreacion: Timestamp.now(), codigoAsistencia: generarCodigo() });
        Alert.alert('Listo', 'Evento creado correctamente.');
      }
      setForm(campoVacio());
      setEditando(null);
      setEventoOriginal(null);
      cargarEventos();
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar: ' + e.message);
    }
  };

  const iniciarEdicion = (evento) => {
    setEditando(evento.id);
    setEventoOriginal(evento);
    setForm({
      titulo: evento.titulo || '',
      organizador: evento.organizador || '',
      lugar: evento.lugar || '',
      fecha: evento.fecha || '',
      hora: evento.Hora || evento.hora || '',
      cuposDisponibles: String(evento.cuposDisponibles || ''),
      descripcion: evento.descripcion || '',
    });
  };

  const eliminar = (id) => {
    Alert.alert('Eliminar evento', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await deleteDoc(doc(db, 'eventos', id));
        cargarEventos();
      }},
    ]);
  };

  const cancelar = () => {
    setForm(campoVacio());
    setEditando(null);
  };

  const generarCodigoEvento = async (evento) => {
    const codigo = generarCodigo();
    await updateDoc(doc(db, 'eventos', evento.id), { codigoAsistencia: codigo });
    cargarEventos();
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={s.container}>
      <Text style={s.titulo}>Panel de Administración</Text>

      <View style={s.formulario}>
        <Text style={s.seccion}>{editando ? 'Editar Evento' : 'Nuevo Evento'}</Text>
        {[
          ['Título *', 'titulo'],
          ['Organizador', 'organizador'],
          ['Lugar *', 'lugar'],
          ['Fecha * (ej: 2026-06-15)', 'fecha'],
          ['Hora * (ej: 10:00 AM)', 'hora'],
          ['Cupos disponibles', 'cuposDisponibles'],
        ].map(([label, campo]) => (
          <View key={campo}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={s.input}
              value={form[campo]}
              onChangeText={v => setForm(prev => ({ ...prev, [campo]: v }))}
              keyboardType={campo === 'cuposDisponibles' ? 'numeric' : 'default'}
              placeholderTextColor="#999"
              placeholder={label}
            />
          </View>
        ))}
        <Text style={s.label}>Descripción</Text>
        <TextInput
          style={[s.input, { height: 80 }]}
          value={form.descripcion}
          onChangeText={v => setForm(prev => ({ ...prev, descripcion: v }))}
          multiline
          placeholderTextColor="#999"
          placeholder="Descripción del evento"
        />
        <TouchableOpacity style={s.boton} onPress={guardar}>
          <Text style={s.botonTexto}>{editando ? 'Guardar cambios' : 'Crear evento'}</Text>
        </TouchableOpacity>
        {editando && (
          <TouchableOpacity style={s.botonCancelar} onPress={cancelar}>
            <Text style={s.botonTexto}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.seccion}>Eventos existentes</Text>
      <FlatList
        data={eventos}
        keyExtractor={e => e.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={s.eventoCard}>
            <Text style={s.eventoTitulo}>{item.titulo}</Text>
            <Text style={s.eventoInfo}>{item.fecha} — {item.Hora || item.hora} | {item.lugar}</Text>
            <Text style={s.eventoInfo}>Cupos: {item.cuposDisponibles}</Text>
            {item.codigoAsistencia ? (
              <View style={s.codigoBox}>
                <Text style={s.codigoLabel}>Código: <Text style={s.codigoValor}>{item.codigoAsistencia}</Text></Text>
                <TouchableOpacity style={s.btnQR} onPress={() => setEventoQR(item)}>
                  <Text style={s.btnTexto}>Ver QR</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={s.btnGenerarCodigo} onPress={() => generarCodigoEvento(item)}>
                <Text style={s.btnTexto}>Generar código QR</Text>
              </TouchableOpacity>
            )}
            <View style={s.acciones}>
              <TouchableOpacity style={s.btnEditar} onPress={() => iniciarEdicion(item)}>
                <Text style={s.btnTexto}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnEliminar} onPress={() => eliminar(item.id)}>
                <Text style={s.btnTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>

      <Modal visible={!!eventoQR} transparent animationType="fade">
        <View style={s.modalFondo}>
          <View style={s.modalCaja}>
            <Text style={s.modalTitulo}>{eventoQR?.titulo}</Text>
            <Text style={s.modalSubtitulo}>Los asistentes deben escanear este QR</Text>
            {eventoQR?.codigoAsistencia && (
              <View style={s.qrContainer}>
                <QRCode value={eventoQR.codigoAsistencia} size={200} />
              </View>
            )}
            <Text style={s.codigoValor}>{eventoQR?.codigoAsistencia}</Text>
            <TouchableOpacity style={s.boton} onPress={() => setEventoQR(null)}>
              <Text style={s.botonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e', marginTop: 40, marginBottom: 12 },
  seccion: { fontSize: 16, fontWeight: '600', color: '#4A90E2', marginVertical: 10 },
  formulario: { backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 20, elevation: 2 },
  label: { fontSize: 13, color: '#555', marginTop: 10, marginBottom: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14, backgroundColor: '#fafafa' },
  boton: { backgroundColor: '#4A90E2', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 },
  botonCancelar: { backgroundColor: '#888', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: '#fff', fontWeight: '600', fontSize: 15 },
  eventoCard: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, elevation: 1 },
  eventoTitulo: { fontSize: 15, fontWeight: '600', color: '#1a1a2e' },
  eventoInfo: { fontSize: 13, color: '#666', marginTop: 2 },
  acciones: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnEditar: { backgroundColor: '#4A90E2', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  btnEliminar: { backgroundColor: '#e53935', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  btnTexto: { color: '#fff', fontSize: 13, fontWeight: '600' },
  codigoBox: { backgroundColor: '#e8f4fd', borderRadius: 8, padding: 10, marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codigoLabel: { fontSize: 13, color: '#555', flex: 1 },
  codigoValor: { fontSize: 20, fontWeight: 'bold', color: '#1565C0', letterSpacing: 4, textAlign: 'center', marginVertical: 8 },
  btnQR: { backgroundColor: '#1565C0', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 12 },
  btnGenerarCodigo: { backgroundColor: '#43a047', borderRadius: 6, padding: 8, alignItems: 'center', marginTop: 8 },
  modalFondo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCaja: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', alignItems: 'center' },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4, textAlign: 'center' },
  modalSubtitulo: { fontSize: 13, color: '#666', marginBottom: 16, textAlign: 'center' },
  qrContainer: { padding: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 2, marginBottom: 8 },
});
