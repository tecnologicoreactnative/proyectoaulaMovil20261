import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  // ──────────────────────────────────────────────
  // 🔝 HEADER
  // ──────────────────────────────────────────────
  header: {
    backgroundColor: '#7A5C3A',
    paddingTop: 44,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  headerBackButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  headerBackArrow: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 22,
  },

  headerLogo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 12,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  // ──────────────────────────────────────────────
  // 📋 FORMULARIO Y FILTROS
  // ──────────────────────────────────────────────
  form: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C3A1E',
    marginBottom: 12,
  },

  input: {
    backgroundColor: '#FDF8F2',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D6C2A8',
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#7A5C3A',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  photoButton: {
    flex: 1,
    backgroundColor: '#D6C2A8',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },

  photoButtonText: {
    color: '#5C3A1E',
    fontWeight: '700',
    fontSize: 13,
  },

  preview: {
    width: '100%',
    height: 170,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#EFE4D5',
  },

  uploadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  uploadingText: {
    marginLeft: 10,
    color: '#5C3A1E',
    fontSize: 14,
  },

  // ──────────────────────────────────────────────
  // 🔽 PICKER / SELECTOR TRIGGER
  // ──────────────────────────────────────────────
  pickerContainer: {
    backgroundColor: '#FDF8F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D6C2A8',
    marginBottom: 12,
    overflow: 'hidden',
  },

  pickerTriggerRow: {
    paddingVertical: 13,
    paddingHorizontal: 15,
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
    fontSize: 17,
  },

  // ──────────────────────────────────────────────
  // 🐾 CARD MASCOTA
  // ──────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE4D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#EFE4D5',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5C3A1E',
    marginBottom: 6,
  },

  text: {
    fontSize: 13,
    color: '#777',
    marginBottom: 3,
  },

  // ──────────────────────────────────────────────
  // 🪟 MODAL SELECTOR
  // ──────────────────────────────────────────────
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#8B6B3F',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  modalHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalHeaderBoton: {
    color: '#FFD080',
    fontSize: 15,
    fontWeight: '600',
  },

  modalFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E8DC',
  },

  modalFilaActiva: {
    backgroundColor: '#FDF3E7',
  },

  modalFilaTextoTodas: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
  },

  modalFilaTexto: {
    fontSize: 15,
    color: '#444',
  },

  modalFilaTextoActivo: {
    color: '#5C3A1E',
    fontWeight: '700',
  },

  modalCheck: {
    color: '#8B6B3F',
    fontSize: 17,
    fontWeight: 'bold',
  },
});