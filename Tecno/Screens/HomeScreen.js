import React from 'react';
import { View, Text, Button } from 'react-native';
const HomeScreen = ({ navigation }) => {
 return (
 <View style={{ flex: 1, justifyContent: 'center', alignItems:
'center' }}>
 <Text> Pantalla de Inicio</Text>
 <Button title="Ir a Detalles" onPress={() =>
navigation.navigate('Details')} />
 </View>
 );
};
export default HomeScreen;
