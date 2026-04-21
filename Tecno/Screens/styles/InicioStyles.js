import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  bienvenido: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  email: {
    fontSize: 14,
    color: '#1976D2',
    marginTop: 5,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 15,
  },
  botonCerrar: {
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarjeta: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 3 },
  tituloEvento: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 6 },
  infoEvento: { fontSize: 14, color: '#555', marginBottom: 2 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, fontSize: 14, elevation: 2, color: '#333' },
  vacio: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
});

export default styles; 