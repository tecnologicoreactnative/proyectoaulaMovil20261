import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';

import { db, auth } from '../firebaseConfig';
import { colors } from '../styles/colors';

// ──────────────────────────────────────────────
// CONFIG ESTADOS
// ──────────────────────────────────────────────
const ESTADO_CONFIG = {
  aprobada: {
    color: '#2E7D32',
    bg: '#E8F5E9',
    bar: '#4CAF50',
    icon: '✓',
    label: 'Aprobada',
  },

  pendiente: {
    color: '#E65100',
    bg: '#FFF3E0',
    bar: '#FF8C00',
    icon: '⏳',
    label: 'Pendiente',
  },

  revision: {
    color: '#1565C0',
    bg: '#E3F2FD',
    bar: '#42A5F5',
    icon: '👀',
    label: 'Revisión',
  },

  rechazada: {
    color: '#B71C1C',
    bg: '#FFEBEE',
    bar: '#EF5350',
    icon: '✕',
    label: 'Rechazada',
  },

  cancelada: {
    color: '#757575',
    bg: '#F5F5F5',
    bar: '#BDBDBD',
    icon: '—',
    label: 'Cancelada',
  },
};

// ──────────────────────────────────────────────
// HEADER
// ──────────────────────────────────────────────
const ProHeader = ({
  titulo,
  subtitulo = 'ADOPCIÓN',
  onBack,
}) => (
  <View>

    <View style={headerStyles.header}>

      <TouchableOpacity
        onPress={onBack}
        style={headerStyles.backBtn}
      >
        <Text style={headerStyles.backArrow}>
          ‹
        </Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/icono.png')}
        style={headerStyles.logo}
      />

      <View style={headerStyles.titleWrap}>

        <Text style={headerStyles.title}>
          {titulo}
        </Text>

        <Text style={headerStyles.subtitle}>
          {subtitulo}
        </Text>

      </View>

    </View>

    <View style={headerStyles.stepsBar} />

  </View>
);

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

  titleWrap: {
    flex: 1,
  },

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

// ──────────────────────────────────────────────
// CARD
// ──────────────────────────────────────────────
const SolicitudCard = ({
  item,
  onCancelar,
  esFundacion,
  onActualizarEstado,
}) => {

  const config =
    ESTADO_CONFIG[item.estado] ||
    ESTADO_CONFIG.pendiente;

  const [comentario, setComentario] =
    useState(
      item.comentarioFundacion || ''
    );

  return (

    <View style={cardStyles.card}>

      <View
        style={[
          cardStyles.topBar,
          {
            backgroundColor: config.bar,
          },
        ]}
      />

      <View style={cardStyles.body}>

        <View style={cardStyles.headerRow}>

          <View
            style={[
              cardStyles.avatar,
              {
                backgroundColor: config.bg,
              },
            ]}
          >
            <Text style={cardStyles.avatarEmoji}>
              🐾
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              marginLeft: 12,
            }}
          >

            <Text style={cardStyles.nombre}>
              {item.mascotaNombre}
            </Text>

            <View
              style={[
                cardStyles.badge,
                {
                  backgroundColor:
                    config.bg,
                },
              ]}
            >

              <Text
                style={[
                  cardStyles.badgeText,
                  {
                    color: config.color,
                  },
                ]}
              >
                {config.icon} {config.label}
              </Text>

            </View>

          </View>

        </View>

        <View style={cardStyles.divider} />

        {/* 👤 DATOS */}
        <Text style={cardStyles.infoText}>
          👤 {item.solicitanteNombre}
        </Text>

        <Text style={cardStyles.infoText}>
          📞 {item.solicitanteTelefono}
        </Text>

        {/* 🏢 FUNDACIÓN */}
        {!esFundacion && (
          <Text style={cardStyles.infoText}>
            🏢 {item.fundacionNombre}
          </Text>
        )}

        {/* 💬 MENSAJE */}
        <View style={cardStyles.mensajeBox}>

          <Text style={cardStyles.mensajeLabel}>
            Mensaje
          </Text>

          <Text style={cardStyles.mensajeTexto}>
            {item.solicitanteMensaje}
          </Text>

        </View>

        {/* 💬 COMENTARIO FUNDACIÓN */}
        {esFundacion && (

          <TextInput
            placeholder="Comentario para el usuario..."
            value={comentario}
            onChangeText={setComentario}
            multiline
            style={cardStyles.input}
          />

        )}

        {/* 👤 VER RESPUESTA */}
        {!esFundacion &&
          item.comentarioFundacion ? (

          <View style={cardStyles.comentarioBox}>

            <Text
              style={cardStyles.mensajeLabel}
            >
              Respuesta Fundación
            </Text>

            <Text
              style={cardStyles.mensajeTexto}
            >
              {item.comentarioFundacion}
            </Text>

          </View>

        ) : null}

        {/* 🏢 BOTONES FUNDACIÓN */}
        {esFundacion && item.estado !== 'cancelada' ? (

          <>

            <TouchableOpacity
              style={[
                cardStyles.actionBtn,
                {
                  backgroundColor:
                    '#4CAF50',
                },
              ]}
              onPress={() =>
                onActualizarEstado(
                  item.id,
                  'aprobada',
                  comentario
                )
              }
            >

              <Text
                style={cardStyles.actionText}
              >
                ✓ Aprobar
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                cardStyles.actionBtn,
                {
                  backgroundColor:
                    '#42A5F5',
                },
              ]}
              onPress={() =>
                onActualizarEstado(
                  item.id,
                  'revision',
                  comentario
                )
              }
            >

              <Text
                style={cardStyles.actionText}
              >
                👀 Revisar
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[
                cardStyles.actionBtn,
                {
                  backgroundColor:
                    '#EF5350',
                },
              ]}
              onPress={() =>
                onActualizarEstado(
                  item.id,
                  'rechazada',
                  comentario
                )
              }
            >

              <Text
                style={cardStyles.actionText}
              >
                ✕ Rechazar
              </Text>

            </TouchableOpacity>

          </>

        ) : esFundacion && item.estado === 'cancelada' ? (

          <View style={cardStyles.cancelInfoBox}>
            <Text style={cardStyles.cancelInfoText}>
              La solicitud ya fue cancelada por el usuario y no puede modificarse.
            </Text>
          </View>

        ) : null}

        {/* 👤 CANCELAR */}
        {!esFundacion &&
          item.estado !==
            'cancelada' && (

          <TouchableOpacity
            style={cardStyles.cancelBtn}
            onPress={() =>
              onCancelar(item.id)
            }
          >

            <Text
              style={
                cardStyles.cancelBtnText
              }
            >
              Cancelar solicitud
            </Text>

          </TouchableOpacity>

        )}

      </View>

    </View>
  );
};

// ──────────────────────────────────────────────
// PANTALLA
// ──────────────────────────────────────────────
const MisSolicitudesScreen = () => {

  const navigation = useNavigation();

  const [solicitudes, setSolicitudes] =
    useState([]);

  const [tipoUsuario, setTipoUsuario] =
    useState('');

  // 🔥 VALIDAR TIPO USUARIO
  useEffect(() => {

    const obtenerUsuario = async () => {

      const ref = doc(
        db,
        'usuarios',
        auth.currentUser.uid
      );

      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        setTipoUsuario(
          data.tipo_usuario || ''
        );
      }
    };

    obtenerUsuario();

  }, []);

  // 🔥 TRAER SOLICITUDES
  useEffect(() => {

    if (!tipoUsuario) return;

    let q;

    // 🏢 FUNDACIÓN
    if (tipoUsuario === 'fundacion') {

      q = query(
        collection(db, 'solicitudes'),
        where(
          'fundacionId',
          '==',
          auth.currentUser.uid
        )
      );

    } else {

      // 👤 USUARIO
      q = query(
        collection(db, 'solicitudes'),
        where(
          'userId',
          '==',
          auth.currentUser.uid
        )
      );
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const data =
          snapshot.docs.map(d => ({
            id: d.id,
            ...d.data(),
          }));

        setSolicitudes(data);
      }
    );

    return unsubscribe;

  }, [tipoUsuario]);

  // 🔥 CANCELAR
  const cancelarSolicitud = async (
    id
  ) => {

    await updateDoc(
      doc(db, 'solicitudes', id),
      {
        estado: 'cancelada',
      }
    );
  };

  // 🔥 FUNDACIÓN ACTUALIZA
  const actualizarEstado =
    async (
      id,
      estado,
      comentario
    ) => {

      const solicitudRef = doc(db, 'solicitudes', id);
      const solicitudSnap = await getDoc(solicitudRef);

      if (
        solicitudSnap.exists() &&
        solicitudSnap.data().estado === 'cancelada'
      ) {
        Alert.alert(
          'Acción inválida',
          'No se puede cambiar el estado de una solicitud cancelada.'
        );
        return;
      }

      await updateDoc(solicitudRef, {
        estado: estado,
        comentarioFundacion:
          comentario,
      });

      Alert.alert(
        'Éxito',
        'Solicitud actualizada'
      );
    };

  return (

    <View
      style={{
        flex: 1,
        backgroundColor:
          colors.background,
      }}
    >

      <ProHeader
        titulo={
          tipoUsuario ===
          'fundacion'
            ? 'Solicitudes recibidas'
            : 'Mis solicitudes'
        }
        onBack={() =>
          navigation.goBack()
        }
      />

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >

        {solicitudes.length === 0 ? (

          <Text
            style={{
              textAlign: 'center',
              marginTop: 40,
              color: '#aaa',
            }}
          >
            No hay solicitudes
          </Text>

        ) : (

          solicitudes.map(item => (

            <SolicitudCard
              key={item.id}
              item={item}
              esFundacion={
                tipoUsuario ===
                'fundacion'
              }
              onCancelar={
                cancelarSolicitud
              }
              onActualizarEstado={
                actualizarEstado
              }
            />

          ))
        )}

      </ScrollView>

    </View>
  );
};

// ──────────────────────────────────────────────
// STYLES
// ──────────────────────────────────────────────
const cardStyles = StyleSheet.create({

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
  },

  topBar: {
    height: 5,
    width: '100%',
  },

  body: {
    padding: 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarEmoji: {
    fontSize: 24,
  },

  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },

  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.textLight,
  },

  mensajeBox: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },

  comentarioBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },

  mensajeLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.primary,
  },

  mensajeTexto: {
    fontSize: 14,
    color: '#555',
  },

  cancelInfoBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  cancelInfoText: {
    fontSize: 14,
    color: '#BF360C',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },

  actionBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  cancelBtn: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },

  cancelBtnText: {
    color: '#C62828',
    fontWeight: 'bold',
  },
});

export default MisSolicitudesScreen;