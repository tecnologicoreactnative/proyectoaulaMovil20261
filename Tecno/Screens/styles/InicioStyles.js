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
  cuerpo: {
    flex: 1,
    marginTop: 30,
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
});

export default styles;