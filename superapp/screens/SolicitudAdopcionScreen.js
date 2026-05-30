import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';

import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from 'firebase/firestore';

import { useNavigation } from '@react-navigation/native';

import { db, auth } from '../firebaseConfig';

import { styles } from '../styles/SolicitudAdopcionStyles';

const AVATAR_COLORS = [
  '#FFE0B2',
  '#E0D7FF',
  '#C8E6C9',
  '#FFDDD2',
  '#D0E8FF',
];

const SolicitudAdopcionScreen = () => {

  const navigation = useNavigation();

  const [paso, setPaso] = useState(1);

  const [mascotas, setMascotas] = useState([]);

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  const [nombre, setNombre] = useState('');

  const [telefono, setTelefono] = useState('');

  const [mensaje, setMensaje] = useState('');

  // 🔥 NUEVO
  const [tipoUsuario, setTipoUsuario] = useState('');

  const [nombreFundacion, setNombreFundacion] = useState('');

  // 🔥 VALIDAR USUARIO
  useEffect(() => {

    const obtenerUsuario = async () => {

      try {

        const user = auth.currentUser;

        if (!user) return;

        const userRef = doc(
          db,
          'usuarios',
          user.uid
        );

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

          const data = userSnap.data();

          setTipoUsuario(
            data.tipo_usuario || ''
          );

          setNombreFundacion(
            data.nombre_fundacion || ''
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

    obtenerUsuario();

  }, []);

  // 🔥 TRAER MASCOTAS
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

  const siguiente = () =>
    setPaso(paso + 1);

  const atras = () =>
    setPaso(paso - 1);

  // 🔥 ENVIAR SOLICITUD
  const enviarSolicitud = async () => {

    // 🚫 FUNDACIONES NO PUEDEN
    if (tipoUsuario === 'fundacion') {

      Alert.alert(
        'No permitido',
        'Las fundaciones no pueden enviar solicitudes'
      );

      return;
    }

    if (
      !mascotaSeleccionada ||
      !nombre ||
      !telefono ||
      !mensaje
    ) {

      Alert.alert(
        'Error',
        'Completa todos los campos'
      );

      return;
    }

    try {

      const mascota = mascotas.find(
        m => m.id === mascotaSeleccionada
      );

      await addDoc(
        collection(db, 'solicitudes'),
        {

          // 🐶 MASCOTA
          mascotaId: mascota.id,

          mascotaNombre: mascota.nombre,

          mascotaFoto:
            mascota.foto || '',

          // 🏢 FUNDACIÓN
          fundacionId:
            mascota.fundacionId || '',

          fundacionNombre:
            mascota.fundacionNombre || '',

          // 👤 USUARIO
          userId:
            auth.currentUser.uid,

          solicitanteNombre:
            nombre,

          solicitanteTelefono:
            telefono,

          solicitanteMensaje:
            mensaje,

          // 📌 ESTADO
          estado: 'pendiente',

          // 💬 RESPUESTA
          comentarioFundacion: '',

          // 📅 FECHA
          createdAt:
            serverTimestamp(),
        }
      );

      Alert.alert(
        'Éxito',
        'Solicitud enviada correctamente 🐾'
      );

      // RESET
      setPaso(1);

      setMascotaSeleccionada(null);

      setNombre('');

      setTelefono('');

      setMensaje('');

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo enviar la solicitud'
      );
    }
  };

  return (

    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Inicio')
          }
          style={styles.backBtn}
        >

          <Text style={styles.backArrow}>
            ‹
          </Text>

        </TouchableOpacity>

        <Image
          source={require('../assets/icono.png')}
          style={styles.logo}
        />

        <View style={styles.headerTitleWrap}>

          <Text style={styles.headerTitle}>
            Solicitudes
          </Text>

          <Text style={styles.headerSubtitle}>
            ADOPCIÓN
          </Text>

        </View>

      </View>

      {/* 🔥 MENSAJE FUNDACIÓN */}
      {tipoUsuario === 'fundacion' && (

        <View
          style={{
            backgroundColor: '#FFE5E5',
            padding: 14,
            margin: 16,
            borderRadius: 14,
          }}
        >

          <Text
            style={{
              color: '#B00020',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Las fundaciones no pueden enviar solicitudes
          </Text>

        </View>
      )}

      {/* STEPS */}
      <View style={styles.stepsBar}>

        {[1, 2, 3].map(i => (

          <View
            key={i}
            style={[
              styles.stepDot,
              paso >= i &&
                styles.stepDotActive
            ]}
          />

        ))}

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* 🔥 FUNDACIÓN */}
        {tipoUsuario === 'fundacion' && (

          <TouchableOpacity
            style={styles.myRequestsBtn}
            onPress={() =>
              navigation.navigate(
                'MisSolicitudes'
              )
            }
          >

            <View style={styles.myRequestsLeft}>

              <View style={styles.myRequestsIcon}>
                <Text style={{ fontSize: 15 }}>
                  🏢
                </Text>
              </View>

              <Text
                style={styles.myRequestsLabel}
              >
                Ver solicitudes recibidas
              </Text>

            </View>

            <Text
              style={styles.myRequestsArrow}
            >
              ›
            </Text>

          </TouchableOpacity>
        )}

        {/* 🔥 USUARIO GENERAL */}
        {tipoUsuario !== 'fundacion' && (

          <TouchableOpacity
            style={styles.myRequestsBtn}
            onPress={() =>
              navigation.navigate(
                'MisSolicitudes'
              )
            }
          >

            <View style={styles.myRequestsLeft}>

              <View style={styles.myRequestsIcon}>
                <Text style={{ fontSize: 15 }}>
                  📋
                </Text>
              </View>

              <Text
                style={styles.myRequestsLabel}
              >
                Ver mis solicitudes
              </Text>

            </View>

            <Text
              style={styles.myRequestsArrow}
            >
              ›
            </Text>

          </TouchableOpacity>
        )}

        {/* 🚫 SOLO USUARIO GENERAL */}
        {tipoUsuario !== 'fundacion' && (

          <>

            {/* PASO 1 */}
            {paso === 1 && (

              <View>

                <Text style={styles.stepLabel}>
                  Paso 1 de 3
                </Text>

                <Text style={styles.stepTitle}>
                  Elige una mascota
                </Text>

                <View style={styles.petList}>

                  {mascotas.map((mascota, index) => {

                    const isSelected =
                      mascotaSeleccionada ===
                      mascota.id;

                    return (

                      <TouchableOpacity
                        key={mascota.id}
                        style={[
                          styles.petCard,
                          isSelected &&
                            styles.petCardSelected
                        ]}
                        onPress={() =>
                          setMascotaSeleccionada(
                            mascota.id
                          )
                        }
                      >

                        {mascota.foto ? (

                          <Image
                            source={{
                              uri: mascota.foto
                            }}
                            style={
                              styles.petAvatar
                            }
                          />

                        ) : (

                          <View
                            style={[
                              styles.petAvatar,
                              {
                                backgroundColor:
                                  AVATAR_COLORS[
                                    index %
                                    AVATAR_COLORS.length
                                  ],
                              },
                            ]}
                          />

                        )}

                        <View style={styles.petInfo}>

                          <Text style={styles.petName}>
                            {mascota.nombre}
                          </Text>

                          {mascota.raza ? (
                            <Text style={styles.petBreed}>
                              {mascota.raza}
                            </Text>
                          ) : null}

                          {mascota.fundacionNombre ? (

                            <Text
                              style={{
                                marginTop: 4,
                                color: '#8B6B3F',
                                fontWeight: '600',
                              }}
                            >
                              🏢 {mascota.fundacionNombre}
                            </Text>

                          ) : null}

                        </View>

                        <View
                          style={[
                            styles.petCheck,
                            isSelected &&
                            styles.petCheckSelected
                          ]}
                        >

                          {isSelected && (

                            <Text
                              style={
                                styles.petCheckMark
                              }
                            >
                              ✓
                            </Text>

                          )}

                        </View>

                      </TouchableOpacity>
                    );
                  })}

                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {

                    if (!mascotaSeleccionada) {

                      Alert.alert(
                        'Error',
                        'Selecciona una mascota'
                      );

                      return;
                    }

                    siguiente();
                  }}
                >

                  <Text
                    style={styles.primaryBtnText}
                  >
                    Siguiente
                  </Text>

                  <Text
                    style={styles.primaryBtnArrow}
                  >
                    ›
                  </Text>

                </TouchableOpacity>

              </View>
            )}

            {/* PASO 2 */}
            {paso === 2 && (

              <View>

                <Text style={styles.stepLabel}>
                  Paso 2 de 3
                </Text>

                <Text style={styles.stepTitle}>
                  Tus datos
                </Text>

                <View style={styles.inputGroup}>

                  <Text style={styles.inputLabel}>
                    NOMBRE COMPLETO
                  </Text>

                  <TextInput
                    placeholder="¿Cómo te llamas?"
                    placeholderTextColor="#C4A882"
                    style={styles.input}
                    value={nombre}
                    onChangeText={setNombre}
                  />

                </View>

                <View style={styles.inputGroup}>

                  <Text style={styles.inputLabel}>
                    TELÉFONO
                  </Text>

                  <TextInput
                    placeholder="+57 300 000 0000"
                    placeholderTextColor="#C4A882"
                    style={styles.input}
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                  />

                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => {

                    if (
                      !nombre ||
                      !telefono
                    ) {

                      Alert.alert(
                        'Error',
                        'Completa todos los campos'
                      );

                      return;
                    }

                    siguiente();
                  }}
                >

                  <Text
                    style={styles.primaryBtnText}
                  >
                    Siguiente
                  </Text>

                  <Text
                    style={styles.primaryBtnArrow}
                  >
                    ›
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={atras}
                  style={styles.backLinkWrap}
                >

                  <Text style={styles.backLink}>
                    ← Atrás
                  </Text>

                </TouchableOpacity>

              </View>
            )}

            {/* PASO 3 */}
            {paso === 3 && (

              <View>

                <Text style={styles.stepLabel}>
                  Paso 3 de 3
                </Text>

                <Text style={styles.stepTitle}>
                  Tu mensaje
                </Text>

                <View style={styles.inputGroup}>

                  <Text style={styles.inputLabel}>
                    ¿POR QUÉ QUIERES ADOPTARLA?
                  </Text>

                  <TextInput
                    placeholder="Cuéntanos sobre ti y tu hogar..."
                    placeholderTextColor="#C4A882"
                    style={[
                      styles.input,
                      styles.textArea
                    ]}
                    value={mensaje}
                    onChangeText={setMensaje}
                    multiline
                    textAlignVertical="top"
                  />

                </View>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={enviarSolicitud}
                >

                  <Text
                    style={styles.primaryBtnText}
                  >
                    Enviar solicitud 🚀
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  onPress={atras}
                  style={styles.backLinkWrap}
                >

                  <Text style={styles.backLink}>
                    ← Atrás
                  </Text>

                </TouchableOpacity>

              </View>
            )}

          </>
        )}

      </ScrollView>

    </View>
  );
};

export default SolicitudAdopcionScreen;