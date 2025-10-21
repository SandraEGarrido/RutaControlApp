import React, { useState } from 'react';
import {
	Button,
	Dialog,
	
} from '@rneui/themed';
import { View, ToastAndroid, StyleSheet } from 'react-native';

type DialogComponentProps = {
	handlerDesinscribir: (nombre: string) => void
	nombre: string
}

export default function Dialogo(props: DialogComponentProps) {

	const [confirmar, setConfirmar] = useState<boolean>(false);

	return (
		<View>
			<Button
				title="Cancelar Inscripción"
				onPress={() => setConfirmar(true)}
			/>
			<Dialog
				isVisible={confirmar}
				onBackdropPress={() => setConfirmar(false)}
			>
				<Dialog.Title title={`¿Querés cancelar tu inscripción a esta materia ${props.nombre}?`} />

				<Dialog.Actions>
					<Dialog.Button
						title="SÍ"
						onPress={() => {
							props.handlerDesinscribir(props.nombre); setConfirmar(false);
							ToastAndroid.showWithGravity(
								'✅ Inscripción cancelada correctamente',
								ToastAndroid.LONG,
								ToastAndroid.TOP
							);
						}}
					/>
					<Dialog.Button title="NO" onPress={() => setConfirmar(false)} />
				</Dialog.Actions>
			</Dialog>
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 6,
		width: 220,
		margin: 20,
	},
	buttonContainer: {
		margin: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

