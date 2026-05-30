import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

import { db, auth, storage } from '../firebaseConfig';
import { styles } from '../styles/MascotasStyles';

const SelectorModal = ({
  visible,
  onClose,
  titulo,
  opciones,
  valorActivo,
  onSeleccionar,
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="slide"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
      }}
      activeOpacity={1}
      onPress={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={{
          width: '100%',
          maxHeight: '70%',
          backgroundColor: '#fff',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >

        <View
          style={{
            width: 40,
            height: 4,
            backgroundColor: '#E0D0C0',
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 12,
            marginBottom: 4,
          }}
        />

        <View style={styles.modalHeader}>

          <Text style={styles.modalHeaderTitle}>
            {titulo}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalHeaderBoton}>
              Listo
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          onPress={() => {
            onSeleccionar('');
            onClose();
          }}
          style={[
            styles.modalFila,
            valorActivo === '' &&
              styles.modalFilaActiva,
          ]}
        >

          <Text style={styles.modalFilaTextoTodas}>
            Todas
          </Text>

          {valorActivo === '' && (
            <Text style={styles.modalCheck}>
              ✓
            </Text>
          )}

        </TouchableOpacity>

        <FlatList
          data={opciones}
          keyExtractor={(item, i) =>
            i.toString()
          }
          renderItem={({ item }) => (

            <TouchableOpacity
              onPress={() => {
                onSeleccionar(item);
                onClose();
              }}
              style={[
                styles.modalFila,
                valorActivo === item &&
                  styles.modalFilaActiva,
              ]}
            >

              <Text
                style={[
                  styles.modalFilaTexto,
                  valorActivo === item &&
                    styles.modalFilaTextoActivo,
                ]}
              >
                {item}
              </Text>

              {valorActivo === item && (
                <Text style={styles.modalCheck}>
                  ✓
                </Text>
              )}

            </TouchableOpacity>

          )}
        />

      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const MascotasScreen = () => {

  const navigation = useNavigation();

  const [mascotas, setMascotas] =
    useState([]);

  const [tipoUsuario, setTipoUsuario] =
    useState('');

  const [nombreFundacion,
    setNombreFundacion] =
    useState('');

  // FORM
  const [nombre, setNombre] =
    useState('');

  const [edad, setEdad] =
    useState('');

  const [ubicacion, setUbicacion] =
    useState('');

  const [foto, setFoto] =
    useState('');

  const [isUploading, setIsUploading] =
    useState(false);

  // FILTROS
  const [filtroMascota,
    setFiltroMascota] =
    useState('');

  const [filtroUbicacion,
    setFiltroUbicacion] =
    useState('');

  const [filtroFundacion,
    setFiltroFundacion] =
    useState('');

  // MODALES
  const [modalMascotaVisible,
    setModalMascotaVisible] =
    useState(false);

  const [modalUbicacionVisible,
    setModalUbicacionVisible] =
    useState(false);

  const [modalFundacionVisible,
    setModalFundacionVisible] =
    useState(false);

  // 🔥 VALIDAR USUARIO
  useEffect(() => {

    const obtenerUsuario = async () => {

      try {

        const ref = doc(
          db,
          'usuarios',
          auth.currentUser.uid
        );

        const snap =
          await getDoc(ref);

        if (snap.exists()) {

          const data = snap.data();

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

  const subirImagen = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const nombreArchivo =
        `mascotas/${auth.currentUser.uid}_${Date.now()}.jpg`;
      const storageRef = ref(
        storage,
        nombreArchivo
      );

      const metadata = {
        contentType: blob.type || 'image/jpeg',
      };

      await uploadBytes(storageRef, blob, metadata);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.log('Error subir imagen', error);
      return null;
    }
  };

  const handleImageSelected = async (uri) => {
    if (!uri) return;
    setFoto(uri);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permiso para acceder a tus fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos permiso para usar la cámara.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled) {
      handleImageSelected(result.assets[0].uri);
    }
  };

  // 🔥 TRAER MASCOTAS
  useEffect(() => {

    const q = query(
      collection(db, 'mascotas'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {

        const data =
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

        setMascotas(data);
      });

    return unsubscribe;

  }, []);

  // 🔥 GUARDAR
  const guardarMascota =
    async () => {

      // 🚫 SOLO FUNDACIÓN
      if (
        tipoUsuario !== 'fundacion'
      ) {

        Alert.alert(
          'No permitido',
          'Solo las fundaciones pueden agregar mascotas'
        );

        return;
      }

      if (
        !nombre ||
        !edad ||
        !ubicacion ||
        !foto
      ) {

        Alert.alert(
          'Error',
          'Completa todos los campos'
        );

        return;
      }

      try {

        let fotoUrl = foto;

        if (foto && !foto.startsWith('http')) {
          setIsUploading(true);
          const uploadedUrl = await subirImagen(foto);
          setIsUploading(false);

          if (!uploadedUrl) {
            throw new Error('No se pudo subir la imagen');
          }

          fotoUrl = uploadedUrl;
        }

        await addDoc(
          collection(db, 'mascotas'),
          {

            nombre,
            edad,
            ubicacion,
            foto: fotoUrl,

            // 🔥 FUNDACIÓN
            fundacionId:
              auth.currentUser.uid,

            fundacionNombre:
              nombreFundacion,

            createdAt:
              serverTimestamp(),
          }
        );

        Alert.alert(
          'Éxito',
          'Mascota agregada'
        );

        setNombre('');
        setEdad('');
        setUbicacion('');
        setFoto('');

      } catch {

        Alert.alert(
          'Error',
          'No se pudo guardar'
        );
      }
    };

  // 🔥 ELIMINAR
  const eliminarMascota =
    async (id) => {

      Alert.alert(
        'Eliminar',
        '¿Eliminar mascota?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },

          {
            text: 'Eliminar',

            style: 'destructive',

            onPress: async () => {

              await deleteDoc(
                doc(db, 'mascotas', id)
              );
            },
          },
        ]
      );
    };

  // FILTROS
  const nombresUnicos = [
    ...new Set(
      mascotas.map(m => m.nombre)
    ),
  ];

  const ubicacionesUnicas = [
    ...new Set(
      mascotas.map(
        m => m.ubicacion
      )
    ),
  ];

  const fundacionesUnicas = [
    ...new Set(
      mascotas.map(
        m => m.fundacionNombre
      )
    ),
  ];

  const mascotasFiltradas =
    mascotas.filter(
      m =>

        (filtroMascota === '' ||
          m.nombre ===
            filtroMascota) &&

        (filtroUbicacion === '' ||
          m.ubicacion ===
            filtroUbicacion) &&

        (filtroFundacion === '' ||
          m.fundacionNombre ===
            filtroFundacion)
    );

  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          '#F5F1EA',
      }}
    >

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={
            styles.headerBackButton
          }
        >

          <Text
            style={
              styles.headerBackArrow
            }
          >
            ‹
          </Text>

        </TouchableOpacity>

        <Image
          source={require('../assets/icono.png')}
          style={styles.headerLogo}
        />

        <View>

          <Text
            style={styles.headerTitle}
          >
            Mascotas
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            ADOPCIÓN
          </Text>

        </View>

      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* 🔍 FILTROS */}
        <View style={styles.form}>

          <Text style={styles.title}>
            Buscar mascotas
          </Text>

          {/* MASCOTA */}
          <TouchableOpacity
            style={
              styles.pickerContainer
            }
            onPress={() =>
              setModalMascotaVisible(
                true
              )
            }
          >

            <View
              style={
                styles.pickerTriggerRow
              }
            >

              <Text
                style={[
                  styles.pickerTriggerText,

                  filtroMascota !==
                    '' &&
                    styles.pickerTriggerTextActive,
                ]}
              >
                🐶{' '}
                {filtroMascota ||
                  'Filtrar por mascota'}
              </Text>

              <Text
                style={
                  styles.pickerArrow
                }
              >
                ▾
              </Text>

            </View>

          </TouchableOpacity>

          {/* UBICACIÓN */}
          <TouchableOpacity
            style={
              styles.pickerContainer
            }
            onPress={() =>
              setModalUbicacionVisible(
                true
              )
            }
          >

            <View
              style={
                styles.pickerTriggerRow
              }
            >

              <Text
                style={[
                  styles.pickerTriggerText,

                  filtroUbicacion !==
                    '' &&
                    styles.pickerTriggerTextActive,
                ]}
              >
                📍{' '}
                {filtroUbicacion ||
                  'Filtrar por ubicación'}
              </Text>

              <Text
                style={
                  styles.pickerArrow
                }
              >
                ▾
              </Text>

            </View>

          </TouchableOpacity>

          {/* 🏢 FUNDACIÓN */}
          <TouchableOpacity
            style={
              styles.pickerContainer
            }
            onPress={() =>
              setModalFundacionVisible(
                true
              )
            }
          >

            <View
              style={
                styles.pickerTriggerRow
              }
            >

              <Text
                style={[
                  styles.pickerTriggerText,

                  filtroFundacion !==
                    '' &&
                    styles.pickerTriggerTextActive,
                ]}
              >
                🏢{' '}
                {filtroFundacion ||
                  'Filtrar por fundación'}
              </Text>

              <Text
                style={
                  styles.pickerArrow
                }
              >
                ▾
              </Text>

            </View>

          </TouchableOpacity>

        </View>

        {/* 🔥 SOLO FUNDACIÓN */}
        {tipoUsuario ===
          'fundacion' && (

          <View style={styles.form}>

            <Text
              style={styles.title}
            >
              Agregar mascota
            </Text>

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
              onChangeText={
                setUbicacion
              }
            />

            <View style={styles.photoActions}>
              <TouchableOpacity
                style={styles.photoButton}
                onPress={pickImage}
              >
                <Text style={styles.photoButtonText}>
                  Seleccionar foto
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.photoButton}
                onPress={takePhoto}
              >
                <Text style={styles.photoButtonText}>
                  Tomar foto
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="URL foto (opcional)"
              style={styles.input}
              value={foto}
              onChangeText={setFoto}
            />

            {foto ? (
              <Image
                source={{ uri: foto }}
                style={styles.preview}
              />
            ) : null}

            {isUploading ? (
              <View style={styles.uploadingRow}>
                <ActivityIndicator
                  size="small"
                  color="#7A5C3A"
                />
                <Text style={styles.uploadingText}>
                  Subiendo imagen...
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              onPress={
                guardarMascota
              }
            >

              <Text
                style={
                  styles.buttonText
                }
              >
                Guardar mascota
              </Text>

            </TouchableOpacity>

          </View>

        )}

        {/* 🐾 LISTA */}
        {mascotasFiltradas.map(
          item => (

            <View
              key={item.id}
              style={styles.card}
            >

              {item.foto ? (

                <Image
                  source={{
                    uri: item.foto,
                  }}
                  style={styles.image}
                />

              ) : (

                <View
                  style={[
                    styles.image,
                    {
                      backgroundColor:
                        '#EFE4D5',

                      justifyContent:
                        'center',

                      alignItems:
                        'center',
                    },
                  ]}
                >

                  <Text
                    style={{
                      fontSize: 28,
                    }}
                  >
                    🐾
                  </Text>

                </View>

              )}

              <View style={styles.info}>

                <Text
                  style={styles.name}
                >
                  {item.nombre}
                </Text>

                <Text
                  style={styles.text}
                >
                  Edad: {item.edad}
                </Text>

                <Text
                  style={styles.text}
                >
                  📍{' '}
                  {item.ubicacion}
                </Text>

                {/* 🏢 FUNDACIÓN */}
                <Text
                  style={[
                    styles.text,
                    {
                      marginTop: 4,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  🏢{' '}
                  {
                    item.fundacionNombre
                  }
                </Text>

                {/* 🔥 SOLO LA FUNDACIÓN DUEÑA */}
                {tipoUsuario ===
                  'fundacion' &&

                  item.fundacionId ===
                    auth.currentUser
                      .uid && (

                    <TouchableOpacity
                      onPress={() =>
                        eliminarMascota(
                          item.id
                        )
                      }
                      style={{
                        marginTop: 12,
                        backgroundColor:
                          '#FFEBEE',

                        padding: 10,

                        borderRadius: 12,

                        alignItems:
                          'center',
                      }}
                    >

                      <Text
                        style={{
                          color:
                            '#C62828',

                          fontWeight:
                            'bold',
                        }}
                      >
                        Eliminar mascota
                      </Text>

                    </TouchableOpacity>

                  )}

              </View>

            </View>

          )
        )}

        <View style={{ height: 30 }} />

      </ScrollView>

      {/* MODALES */}
      <SelectorModal
        visible={
          modalMascotaVisible
        }
        onClose={() =>
          setModalMascotaVisible(
            false
          )
        }
        titulo="🐶 Mascota"
        opciones={nombresUnicos}
        valorActivo={
          filtroMascota
        }
        onSeleccionar={
          setFiltroMascota
        }
      />

      <SelectorModal
        visible={
          modalUbicacionVisible
        }
        onClose={() =>
          setModalUbicacionVisible(
            false
          )
        }
        titulo="📍 Ubicación"
        opciones={
          ubicacionesUnicas
        }
        valorActivo={
          filtroUbicacion
        }
        onSeleccionar={
          setFiltroUbicacion
        }
      />

      <SelectorModal
        visible={
          modalFundacionVisible
        }
        onClose={() =>
          setModalFundacionVisible(
            false
          )
        }
        titulo="🏢 Fundación"
        opciones={
          fundacionesUnicas
        }
        valorActivo={
          filtroFundacion
        }
        onSeleccionar={
          setFiltroFundacion
        }
      />

    </SafeAreaView>
  );
};

export default MascotasScreen;