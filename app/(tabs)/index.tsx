import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, ToastAndroid } from 'react-native';

export default function HomeScreen() {

  const mostraMensaje = () => {
    ToastAndroid.showWithGravity('Se ha ingresado correctamente!', ToastAndroid.LONG, ToastAndroid.TOP);
  };
  return (
    <View style={styles.container}>

      <Image
        style={styles.logo}
        source={{
          uri: 'https://ifes.edu.ar/assets/img/logo.png',
        }}
      />
      <Text style={styles.titulo}>Bienvenido al sistema de gestión del alumno de IFES</Text>

      <View style={styles.form}>
        <Text style={styles.subtitulo}>Ingrese sus credenciales</Text>

        <TextInput style={styles.input}
          placeholder='Ingrese su DNI'
          keyboardType='numeric'
        />
        <TextInput style={styles.input}
          placeholder='Ingrese su Usuario'
          keyboardType="default"   // 👈 teclado de letras
        />
        <TextInput style={styles.input}
          secureTextEntry={true}
          keyboardType="default"   // 👈 teclado de letras
          placeholder='Ingrese su contraseña'
        />
        <TouchableOpacity style={styles.botonIngresar} onPress={mostraMensaje}>
          <Text style={styles.textoBoton}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 18,
    textAlign: "center",   // 👈 centra el texto horizontalmente
  },
  form: {
    borderColor: "black",
    borderWidth: 2,
    marginTop: 10,
    padding: 20,
    width: "90%",
    borderRadius: 5
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6B800",   // mismo color que el botón

    height: 60,
    marginTop: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: "center"
  },
  logo: {
    width: 350,
    height: 110
  },
  botonIngresar: {
    marginTop: 20,        // separación desde el último input
    backgroundColor: '#E6B800',
    paddingVertical: 12,  // altura del botón
    borderRadius: 8,      // esquinas redondeadas
    alignItems: 'center', // centra el texto horizontalmente
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitulo: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",   // centra el texto
    fontWeight: "bold",
    marginBottom: 10        // separa del primer input
  },

});
