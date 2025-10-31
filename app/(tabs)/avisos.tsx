// =======================================================
// 📢 MÓDULO DE AVISOS – RutaControlApp
// Permite al chofer enviar avisos a diferentes áreas de la empresa
// (Mecánica, Administración, Viajes) que se guardan en Firestore.
// =======================================================

import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { enviarAviso } from '@/firebase/funciones';

// =======================================================
// 🧰 COMPONENTE: AVISOS DEL CHOFER
// =======================================================
export default function Avisos() {
  // Estados de formulario
  const [loading, setLoading] = useState<boolean>(false);
  const [tipoAviso, setTipoAviso] = useState<string>('Mecánica'); // tipo de aviso (selector)
  const [titulo, setTitulo] = useState<string>('');                // nuevo campo para el título
  const [descripcion, setDescripcion] = useState<string>('');      // texto del mensaje o incidente

  // Limpia el formulario después del envío
  function limpiarForm() {
    setTipoAviso('Mecánica');
    setTitulo('');
    setDescripcion('');
  }

  // Muestra mensaje de confirmación
  function avisoEnviado() {
    setLoading(false);
    ToastAndroid.showWithGravity(
      '✅ Aviso enviado correctamente',
      ToastAndroid.LONG,
      ToastAndroid.TOP
    );
    limpiarForm();
  }

  // Envía el aviso a Firebase
  async function guardarAviso() {
    // Validamos campos antes de enviar
    if (titulo.trim() === '' || descripcion.trim() === '') {
      ToastAndroid.show('Por favor, complete todos los campos.', ToastAndroid.SHORT);
      return;
    }

    // Armamos el objeto de aviso con todos los datos
    const nuevoAviso = {
      tipo: tipoAviso,
      titulo: titulo,
      descripcion: descripcion,
      fecha: new Date().toLocaleString(),
    };

    try {
      setLoading(true);
      await enviarAviso(nuevoAviso); // guardamos en Firestore
      avisoEnviado();
    } catch (error) {
      console.error('❌ Error al guardar aviso:', error);
      setLoading(false);
    }
  }

  // =======================================================
  // 🧩 RENDERIZADO
  // =======================================================
  return (
    <View style={styles.container}>
      {/* 🔹 Título principal de la pantalla */}
      <Text style={styles.titulo}>🧾 Nuevo aviso</Text>

      <View style={styles.card}>
        {/* 🔸 Selector del tipo de aviso */}
        <Text style={styles.label}>Seleccione el tipo de aviso:</Text>
        <Picker
          style={styles.picker}
          selectedValue={tipoAviso}
          onValueChange={(itemValue) => setTipoAviso(itemValue)}
        >
          <Picker.Item label="Mecánica" value="Mecánica" />
          <Picker.Item label="Administración" value="Administración" />
          <Picker.Item label="Viajes" value="Viajes" />
          <Picker.Item label="Contable" value="Contable" />
          <Picker.Item label="Otros" value="Otros" />
        </Picker>

        {/* 🔸 Campo de título */}
        <Text style={styles.label}>Título del aviso:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Avería en la unidad o solicitud administrativa"
          placeholderTextColor="#666"
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* 🔸 Campo de descripción */}
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describa brevemente el aviso o incidencia"
          placeholderTextColor="#666"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
        />

        {/* 🔸 Botón de envío */}
        <TouchableOpacity style={styles.boton} onPress={guardarAviso}>
          <Text style={styles.textoBoton}>Enviar Aviso</Text>
        </TouchableOpacity>
      </View>

      {/* 🔄 Indicador de carga */}
      {loading && (
        <ActivityIndicator size="large" color="#FF6F61" style={{ marginTop: 20 }} />
      )}
    </View>
  );
}

// =======================================================
// 🎨 ESTILOS – Paleta institucional RutaControl
// =======================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // gris claro
    alignItems: 'center',
    paddingTop: 80,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b2a2f', // verde oscuro
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderColor: '#E6B800', // dorado institucional
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    color: '#1b2a2f',
    fontWeight: '600',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6B800',
    marginBottom: 10,
    color: '#1b2a2f',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6B800',
    color: '#1b2a2f',
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E6B800',
    color: '#1b2a2f',
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top', // alinea texto arriba
  },
  boton: {
    backgroundColor: '#FF6F61', // coral principal
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});