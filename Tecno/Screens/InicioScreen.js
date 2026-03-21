import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthContexto } from '../contextos/AuthContexto';
import styles from './styles/InicioStyles';

// ↓ Agregar navigation como prop
const InicioScreen = ({ navigation }) => {
  const { usuario, cerrarSesion } = useContext(AuthContexto);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bienvenido}>¡Bienvenido! 😊</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      <View style={styles.cuerpo}>
        {/* ↓ Cambiar Text por TouchableOpacity para que navegue */}
        <TouchableOpacity onPress={() => navigation.navigate('ListaEventos')}>
          <Text style={styles.subtitulo}>Próximos Eventos →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botonCerrar} onPress={cerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar Sesión 🔒</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InicioScreen; 