import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 🔝 HEADER
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
    marginLeft: 12,
    flex: 1,
  },

  // 📋 FORMULARIOS
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

  // 🎨 PICKER TRIGGER (botón que abre el modal)
  pickerContainer: {
    backgroundColor: '#FDF8F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D6C2A8',
    marginTop: 10,
    marginBottom: 10,
    overflow: 'hidden',

    shadowColor: '#8B6B3F',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  pickerTriggerRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  pickerTriggerText: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '400',
  },

  pickerTriggerTextActive: {
    color: '#5C3A1E',
    fontWeight: '600',
  },

  pickerArrow: {
    color: '#8B6B3F',
    fontSize: 16,
  },

  // 🪟 MODAL – fondo oscuro (ocupa toda la pantalla y empuja el panel abajo)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  // 🪟 MODAL – panel (flujo normal, al fondo gracias al justifyContent del overlay)
  modalPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderColor: '#D6C2A8',
    overflow: 'hidden',
    maxHeight: '60%',
  },

  // 🪟 MODAL – header café
  modalHeader: {
    backgroundColor: '#8B6B3F',
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalHeaderTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  modalHeaderBoton: {
    color: '#FF8C00',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // 🪟 MODAL – fila de opción
  modalFila: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EDE3D6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalFilaActiva: {
    backgroundColor: '#FDF3E8',
  },

  modalFilaTexto: {
    fontSize: 15,
    fontWeight: '400',
    color: '#5C3A1E',
  },

  modalFilaTextoActivo: {
    fontWeight: '600',
  },

  modalFilaTextoTodas: {
    color: '#aaa',
    fontStyle: 'italic',
    fontSize: 14,
  },

  modalCheck: {
    color: '#FF8C00',
    fontSize: 16,
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
    backgroundColor: colors.primary,
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