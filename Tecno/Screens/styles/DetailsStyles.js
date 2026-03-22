import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  fondo: { flex: 1, backgroundColor: '#f0f4f8', padding: 16 },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tarjetaBlanca: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 3 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  organizador: { fontSize: 14, color: '#888', marginTop: 4 },
  separador: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 14 },
  textoBasico: { fontSize: 15, color: '#333', marginBottom: 8 },
  subtitulo: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e' },
  descripcion: { fontSize: 14, color: '#555', marginTop: 6 },
  botonInscribir: { backgroundColor: '#4A90E2', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  textoBoton: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cajaExito: { backgroundColor: '#e6f4ea', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  textoExito: { color: '#2e7d32', fontSize: 15, fontWeight: '600' },
}); 