import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AuthContexto } from '../contextos/AuthContexto';
import { Ionicons } from '@expo/vector-icons';

export default function BannerNotificaciones() {
  const { notificaciones, descartarNotificacion } = useContext(AuthContexto);
  const [indice, setIndice] = useState(0);

  if (!notificaciones || notificaciones.length === 0) return null;

  const notif = notificaciones[Math.min(indice, notificaciones.length - 1)];
  const total = notificaciones.length;

  const anterior = () => setIndice(i => Math.max(0, i - 1));
  const siguiente = () => setIndice(i => Math.min(total - 1, i + 1));

  const descartar = () => {
    descartarNotificacion(notif.id);
    setIndice(i => Math.max(0, i - 1));
  };

  return (
    <View style={s.banner}>
      <View style={s.icono}>
        <Ionicons name="notifications" size={18} color="#fff" />
      </View>
      <View style={s.contenido}>
        <Text style={s.titulo} numberOfLines={1}>{notif.titulo}</Text>
        <Text style={s.mensaje} numberOfLines={2}>{notif.mensaje}</Text>
        {total > 1 && (
          <View style={s.paginacion}>
            <TouchableOpacity onPress={anterior} disabled={indice === 0}>
              <Ionicons name="chevron-back" size={16} color={indice === 0 ? '#aaa' : '#fff'} />
            </TouchableOpacity>
            <Text style={s.paginacionTexto}>{indice + 1} / {total}</Text>
            <TouchableOpacity onPress={siguiente} disabled={indice === total - 1}>
              <Ionicons name="chevron-forward" size={16} color={indice === total - 1 ? '#aaa' : '#fff'} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={descartar} style={s.cerrar}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 999,
    elevation: 10,
  },
  icono: { marginRight: 10 },
  contenido: { flex: 1 },
  titulo: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  mensaje: { color: '#BBDEFB', fontSize: 12, marginTop: 2 },
  cerrar: { padding: 4, marginLeft: 8 },
  paginacion: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  paginacionTexto: { color: '#fff', fontSize: 11 },
});
