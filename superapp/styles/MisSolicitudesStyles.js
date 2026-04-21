import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 🔝 HEADER LIMPIO (YA NO PARECE BOTÓN)
header: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.primaryDark,
  paddingVertical: 14,
  paddingHorizontal: 18,
},

logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},

headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: colors.white,
  marginLeft: 12, // 👈 separa del logo
  flex: 1, // 👈 ocupa espacio y centra mejor visualmente
},

  // 📦 CONTENIDO
  content: {
    paddingTop: 12,
    paddingBottom: 20,
  },

  // 🧾 CARDS BONITAS
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    marginTop: 12, // 👈 separación real
    borderWidth: 10,
    borderColor: colors.border,

    shadowColor: colors.glow,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },

  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  // 🏷 badge de estado
  estadoBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  estadoText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },

  // 🔘 botón
  btn: {
    marginTop: 12,
    backgroundColor: colors.primaryDark,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',

    shadowColor: colors.glow,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },

  btnText: {
    color: colors.white,
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: colors.textLight,
  },
});