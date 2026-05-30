import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { colors } from '../styles/colors';

const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 26,
    color: colors.primaryLight,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 10,
  },
  titleWrap: { flex: 1 },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.primaryLight,
    fontSize: 10,
    letterSpacing: 2,
  },
  stepsBar: {
    height: 3,
    backgroundColor: colors.primaryDark,
  },
});

const ESTADO_LABELS = {
  aprobada: 'Aprobada',
  pendiente: 'Pendiente',
  revision: 'En revisión',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
};

const HistorialAdopcionesScreen = () => {
  const navigation = useNavigation();
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerUsuario = async () => {
      const ref = doc(
        db,
        'usuarios',
        auth.currentUser.uid
      );
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setTipoUsuario(snap.data().tipo_usuario || '');
      }
    };

    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (!tipoUsuario) return;

    const campo =
      tipoUsuario === 'fundacion'
        ? 'fundacionId'
        : 'userId';

    const q = query(
      collection(db, 'solicitudes'),
      where(campo, '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSolicitudes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return unsubscribe;
  }, [tipoUsuario]);

  const solicitudesHistorial = solicitudes.filter(
    (item) => item.estado !== 'pendiente'
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1EA' }}>
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.backBtn}>
          <Text style={headerStyles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Image source={require('../assets/icono.png')} style={headerStyles.logo} />

        <View style={headerStyles.titleWrap}>
          <Text style={headerStyles.title}>Historial adopciones</Text>
          <Text style={headerStyles.subtitle}>Seguimiento de solicitudes</Text>
        </View>
      </View>

      <View style={headerStyles.stepsBar} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Historial de adopciones
        </Text>

        <Text style={styles.subtitle}>
          Aquí ves el seguimiento de solicitudes finalizadas y adoptadas.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : solicitudesHistorial.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay solicitudes finalizadas aún.
          </Text>
        ) : (
          solicitudesHistorial.map((item) => (
            <View
              key={item.id}
              style={styles.card}
            >
              <View style={styles.statusBar(item.estado)} />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>
                  {item.mascotaNombre || 'Mascota'}
                </Text>
                <Text style={styles.cardText}>
                  Estado: {ESTADO_LABELS[item.estado] || item.estado}
                </Text>
                {item.fundacionNombre ? (
                  <Text style={styles.cardText}>
                    Fundación: {item.fundacionNombre}
                  </Text>
                ) : null}
                {item.descripcion ? (
                  <Text style={styles.cardText}>
                    {item.descripcion}
                  </Text>
                ) : null}
                <Text style={styles.cardNote}>
                  {item.comentarioFundacion || 'Sin comentario adicional.'}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1EA',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5C3A1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8A6E4E',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
  },
  statusBar: (estado) => ({
    height: 6,
    backgroundColor:
      estado === 'aprobada'
        ? '#4CAF50'
        : estado === 'rechazada'
        ? '#EF5350'
        : estado === 'cancelada'
        ? '#757575'
        : '#1565C0',
  }),
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5C3A1E',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  cardNote: {
    fontSize: 13,
    color: '#7A5C3A',
    marginTop: 8,
  },
});

export default HistorialAdopcionesScreen;
