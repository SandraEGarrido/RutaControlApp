import { View, Text, StyleSheet } from 'react-native'
import { ListItem, Card } from '@rneui/base'
import { IMateria } from '@/app/types/IMateria';
import Dialogo from './Dialogo';

export default function Materia(props: IMateria) {

	return (
		<ListItem>
			<ListItem.Content>
				<View style={styles.materia}>
					<Card>
						<Card.Title>{props.nombre}</Card.Title>
						<Card.Divider />
						<View>
							<Text style={{ fontSize: 20 }}>Profesor: {props.profesor.nombre} {props.profesor.apellido}</Text>
							<Text style={{ marginTop: 5, fontSize: 17 }} >{props.horario}</Text>
							{props.descripcion &&
								<Text style={{ marginTop: 5, fontSize: 17, marginBottom: 5 }}>
									{props.descripcion}
								</Text>
							}
						</View>
						<Dialogo
						handlerDesinscribir={props.handlerDesinscribir}
						id={props.id}
						nombre={props.nombre}
						/>
					</Card>
				</View>
			</ListItem.Content>
		</ListItem>
	)
}
const styles = StyleSheet.create({
	materia: {
		width: "100%"
	}
})