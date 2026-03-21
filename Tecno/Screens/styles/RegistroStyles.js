import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#1976D2',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#BBDEFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#0D47A1',
    fontSize: 16,
  },
  boton: {
    width: '100%',
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkTexto: {
    color: '#1976D2',
    fontSize: 14,
    marginTop: 10,
  },
  error: {
    color: '#D32F2F',
    marginBottom: 10,
  },
});

export default styles;