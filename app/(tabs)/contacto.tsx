import { StyleSheet, View, Text, TextInput, TouchableOpacity, ToastAndroid } from 'react-native';

import React, { useState } from 'react';

import { Picker } from '@react-native-picker/picker';

export default function TabTwoScreen() {

  const [departamento, setDepartamento] = useState<string>()
  const [asunto, setAsunto] = useState<string>()
  const [comentario, setComentario] = useState<string>()

  function mostrarMensaje() {
    console.log({
      departamento: departamento,
      asunto: asunto,
      comentario: comentario
    })
    ToastAndroid.showWithGravity('El mensaje ha sido enviado !!', ToastAndroid.LONG, ToastAndroid.TOP)
    limpiarForm()
  }

  function limpiarForm(){
    setDepartamento("")
    setAsunto("")
    setComentario("")
  }

  function handleAsunto(value: string) {
    setAsunto(value)
  }

  function handleComentario(value: string) {
    setComentario(value)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Envíanos tu mensaje</Text>


      <View style={styles.form}>
        {/* Subtítulo con estilo mejorado */}
        <Text style={styles.subtitulo}>Seleccione el departamento con el cual quiere comunicarse</Text>

        <Picker
          style={styles.picker}
          selectedValue={departamento}
          onValueChange={(itemValue, itemIndex) =>
            setDepartamento(itemValue)
          }>
          <Picker.Item label="Alumnos" value="alumnos" />
          <Picker.Item label="Bienestar" value="bienestar" />
          <Picker.Item label="Administración" value="administracion" />
          <Picker.Item label="Contable" value="contable" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder='Ingrese el asunto'
          keyboardType="default"
          value={asunto}
          onChangeText={handleAsunto}
        />

        {/* Bloque de comentario estilizado */}
        <View style={styles.comentarioContainer}>
          <TextInput
            editable
            multiline
            numberOfLines={4}
            maxLength={200}
            style={styles.comentarioInput}
            placeholder='Ingrese aquí su comentario'
            value={comentario}
            onChangeText={handleComentario}
          />
        </View>
        <TouchableOpacity style={styles.botonIngresar} onPress={mostrarMensaje}>
          <Text style={styles.textoBoton}>Enviar Mensaje</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  form: {
    borderColor: "#E6B800",    // mismo dorado del botón para uniformar
    borderWidth: 1.5,
    marginTop: 10,
    padding: 20,
    width: "90%",
    borderRadius: 10,          // un poco más redondeado
    backgroundColor: "#ffffff", // fondo blanco para efecto de tarjeta

    // 👇 sombra para Android y iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  titulo: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#1b2a2f",
    marginBottom: 10,
    marginTop: 30,   // 👈 agregamos espacio superior
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "left",         // alinea con los inputs
    color: "#555",             // gris medio, para menor peso visual
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E6B800',
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 10,
    color: '#1b2a2f',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E6B800',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    color: '#1b2a2f',
  },
  comentarioContainer: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E6B800',  // mismo dorado del botón
    borderRadius: 8,
    marginTop: 10,
  },
  comentarioInput: {
    padding: 10,
    height: 100,
    fontSize: 16,
    color: '#1b2a2f',
    textAlignVertical: 'top',  // 👈 asegura que empiece desde arriba
  },
  botonIngresar: {
    marginTop: 20,
    backgroundColor: '#E6B800',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

