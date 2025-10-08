import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import { useState } from 'react';
import { ListItem, Card, Dialog } from '@rneui/themed';

export default function Materias() {

    const [confirmar, setConfirmar] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Las materias en las que estás inscripto:</Text>

            <View style={styles.scrollView}>
                <ScrollView>
                    <ListItem>
                        <ListItem.Content>
                            <View style={styles.materia}>
                                <Card>
                                    <Card.Title>Análisis Matemático</Card.Title>
                                    <Card.Divider />
                                    <View>
                                        <Text style={{ fontSize: 20 }}>Profesor: Juan Perez</Text>
                                        <Text style={{ marginTop: 5, fontSize: 17 }} >Horario: Lun. a Vier. de 19 a 21hs.</Text>
                                        <Text style={{ marginTop: 5, fontSize: 17, marginBottom: 5 }}>Descripción: En Análisis Matemático se abordan las bases del cálculo y sus aplicaciones en distintas áreas. El curso busca desarrollar la capacidad de razonamiento y resolución de problemas mediante herramientas analíticas</Text>
                                        <Button
                                            title="Cancelar Inscripción"
                                            onPress={() => setConfirmar(true)}
                                        />

                                        <Dialog
                                            isVisible={confirmar}
                                            onBackdropPress={() => setConfirmar(false)}
                                        >
                                            <Dialog.Title title="¿Querés cancelar tu inscripción a esta materia?" />

                                            <Dialog.Actions>
                                                <Dialog.Button
                                                    title="SÍ"
                                                    onPress={() => setConfirmar(false)}

                                                />
                                                <Dialog.Button title="NO" onPress={() => setConfirmar(false)} />
                                            </Dialog.Actions>
                                        </Dialog>
                                    </View>
                                </Card>
                            </View>
                        </ListItem.Content>
                    </ListItem>
                    <ListItem>
                        <ListItem.Content>
                            <View style={styles.materia}>
                                <Card>
                                    <Card.Title>Introducción a la Programación</Card.Title>
                                    <Card.Divider />
                                    <View>
                                        <Text style={{ fontSize: 20 }}>Profesor: Ana López</Text>
                                        <Text style={{ marginTop: 5, fontSize: 17 }} >Horario: Mar. y Jue. de 20 a 22:30hs.</Text>
                                        <Text style={{ marginTop: 5, fontSize: 17, marginBottom: 5 }}>Descripción: Introducción a la Programación brinda los conceptos fundamentales del pensamiento lógico y algorítmico. Se trabaja con estructuras básicas, variables, condicionales y bucles para resolver problemas mediante el diseño y desarrollo de programas simples.</Text>
                                        <Button
                                            title='Cancelar inscripción'
                                        />
                                    </View>
                                </Card>
                            </View>
                        </ListItem.Content>
                    </ListItem>

                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    titulo: {
        fontSize: 25
    },
    scrollView: {
        width: "100%",
        height: 600,
        marginTop: 10
    },
    materia: {
        width: "100%"
    }
})