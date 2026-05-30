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
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
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

const FundacionesScreen = () => {
  const navigation = useNavigation();
  const [fundaciones, setFundaciones] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'usuarios'),
      where('tipo_usuario', '==', 'fundacion')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFundaciones(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F1EA' }}>
      <View style={headerStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={headerStyles.backBtn}>
          <Text style={headerStyles.backArrow}>‹</Text>
        </TouchableOpacity>

        <Image source={require('../assets/icono.png')} style={headerStyles.logo} />

        <View style={headerStyles.titleWrap}>
          <Text style={headerStyles.title}>Fundaciones</Text>
          <Text style={headerStyles.subtitle}>Encuentra fundaciones locales</Text>
        </View>
      </View>

      <View style={headerStyles.stepsBar} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          Fundaciones
        </Text>

        <Text style={styles.subtitle}>
          Encuentra las fundaciones que cuidan mascotas y reciben adopciones.
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : fundaciones.length === 0 ? (
          <Text style={styles.emptyText}>
            No se encontraron fundaciones.
          </Text>
        ) : (
          fundaciones.map((item) => (
            <View
              key={item.id}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>
                {item.nombre_fundacion || item.email || 'Fundación'}
              </Text>
              <Text style={styles.cardText}>
                {item.descripcion || 'Fundación dedicada a la adopción de mascotas.'}
              </Text>
              {item.ubicacion ? (
                <Text style={styles.cardLabel}>
                  Ubicación: {item.ubicacion}
                </Text>
              ) : null}
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
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#5C3A1E',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#7A5C3A',
    lineHeight: 20,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    color: '#555',
  },
});

export default FundacionesScreen;
