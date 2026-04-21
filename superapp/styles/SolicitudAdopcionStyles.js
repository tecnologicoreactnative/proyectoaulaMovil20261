import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  // 🔝 HEADER MÁS PRO
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

  // 📌 TITULO INTERNO
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: colors.text,
  },

  // 🧊 INPUTS
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    fontSize: 14,
    color: colors.text,
  },

  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },

  // 🎯 BOTÓN PRINCIPAL
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,

    shadowColor: colors.glow,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 7,
  },

  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  // 🔥 BOTÓN SECUNDARIO
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    padding: 13,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: 'center',

    borderWidth: 1,
    borderColor: colors.primary,

    shadowColor: colors.glow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  secondaryButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },

  // 🐶 SELECTOR
  selectorTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: colors.text,
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.inputBg,
  },

  optionSelected: {
    backgroundColor: colors.primary,
  },

  optionText: {
    color: colors.textLight,
    fontSize: 14,
  },

  optionTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },

  // 🔙 ATRÁS
  backText: {
    textAlign: 'center',
    marginTop: 12,
    color: colors.primaryDark,
    fontWeight: 'bold',
    fontSize: 14,
  },
});