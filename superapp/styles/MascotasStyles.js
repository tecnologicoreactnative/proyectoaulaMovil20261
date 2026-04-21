import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 🔝 HEADER PROPORCIONAL Y BONITO
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
  // 📋 FORMULARIO
  form: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.glow,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.inputBg,
    color: colors.text,
  },

  // 🔥 BOTÓN
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,

    shadowColor: colors.glow,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },

  // 🐶 CARDS
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 190,
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: colors.text,
  },

  text: {
    fontSize: 14,
    color: colors.textLight,
  },
  inicioButton: {
  backgroundColor:colors.primary,
  paddingVertical: 14,
  borderRadius: 16,
  alignItems: 'center',
  marginVertical: 10,
  elevation: 3,
},

inicioButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

});