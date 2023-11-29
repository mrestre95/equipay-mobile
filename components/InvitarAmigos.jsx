import React from "react";
import TopBar from "./TopBar";
import { TextInput, HelperText, withTheme, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext'
import { useToast } from "native-base";
import ErrorMessage from "./ErrorMessage";
import { crearGrupoUsuario, invitarAmigos } from "../apis/grupoControllerAPI";

const InvitarAmigos = ({theme}) => {
	const navigation = useNavigation();
	const { keyboardApparience, userToken } = useUserContext();
	const toast = useToast();
  const route = useRoute();

  const id = "grupo-toast";
  const groupData  = route.params;


	const [inputValueEmailInvitados, setInputValueEmailInvitados] = useState('');
  const [touchedEmailInvitados, setTouchedEmailInvitados] = useState(false);

	const [showNombreError, setShowNombreError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	
	const handleInputChangeEmailInvitados = (inputValueEmailInvitados) => {
		setInputValueEmailInvitados(inputValueEmailInvitados);
		setShowNombreError(isEmptyInput(inputValueEmailInvitados));
		setTouchedEmailInvitados(true);
	};

	const handleSendData = async () => {
		try {
			const response = await invitarAmigos(groupData.id, inputValueEmailInvitados, userToken);
			setIsLoading(true)
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Invitaciones enviadas correctamente'}
						type={'success'}
          />
				),
        id,
				placement: "bottom",
        avoidKeyboard: true
			});
		} 
		catch (error) {
			console.error('Error:', error);
			if (error.response) {
				// Si la respuesta contiene datos, imprime el cuerpo de la respuesta
				console.log('Cuerpo de la respuesta de error:', error.response.data);
			}
		} finally {
			setIsLoading(false);
		}
	};
	

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      toast.closeAll()
    });
    return unsubscribe;
  }, [navigation]);

  const handlePress = () => {
		if(inputValueEmailInvitados === ''){
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'No has introducido invitados.\nIntentalo de nuevo.'}
          />
				),
        id,
				placement: "bottom",
        avoidKeyboard: true
			});
		}
		else{
      toast.closeAll()
			handleSendData()
			navigation.navigate('NavigationBar')
    }
	}

	const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}
	
	return (
		<View>
			<TopBar 
				appBarTitle={"Invitar amigos"} 
        actionIcon={'check'}
				showBackAction={true} 
				mode={"center-aligned"}
        actionIconColor={theme.colors.primary}
        action={handlePress}
			/>
			<View style={styles.container}>
				<Text 
            style={[styles.heading, {color:theme.colors.onBackground}]}
            variant="titleSmall"
          >
            Email invitados
          </Text>

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeEmailInvitados}
					value={inputValueEmailInvitados}
					mode="outlined"
					label="Email invitados"
					placeholder="Ingrese emails separados por ','"
					error={touchedEmailInvitados && isEmptyInput(inputValueEmailInvitados)}
					right={<TextInput.Icon icon='account-group'/>}
					keyboardAppearance={keyboardApparience}
          multiline
				/>
				{showNombreError && (
					<HelperText type="error" style={styles.helperText}>
						Debe ingresar al menos un invitado
					</HelperText>
				)}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
		marginHorizontal:15,
  },
	heading:{
    marginTop:15,
		marginBottom:10
	},
	buttonConfirm:{
		width:330,
		height:45,
		margin:18,
	},
	button:{
		marginVertical:8,

	},
	helperText: {
		marginTop:-10,
		marginBottom:-8,
    alignSelf: 'stretch',
	},
	linkText:{
		color:'grey',
		textDecorationLine:'underline'
	}
});


export default withTheme(InvitarAmigos);