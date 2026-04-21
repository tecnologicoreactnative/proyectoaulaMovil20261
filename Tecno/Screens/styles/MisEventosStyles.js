import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F2FD', padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1565C0', marginBottom: 16 },
  vacio: { textAlign: 'center', color: '#1976D2', marginTop: 40, fontSize: 15 },
  tarjeta: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3 },
  nombreEvento: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 6 },
  infoEvento: { fontSize: 14, color: '#555', marginBottom: 2 },
  botonCancelar: { marginTop: 10, backgroundColor: '#ffe5e5', padding: 10, borderRadius: 8, alignItems: 'center' },
  botonCancelarTexto: { color: '#cc0000', fontWeight: 'bold', fontSize: 13 },
}); 