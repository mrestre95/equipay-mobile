import React from "react";
import TopBar from "./TopBar";
import { TextInput, HelperText, withTheme, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext'
import { useToast } from "native-base";
import ErrorMessage from "./ErrorMessage";
import { crearGrupoUsuario } from "../apis/grupoControllerAPI";

const CrearGrupo = ({theme}) => {
	const navigation = useNavigation();
	const { keyboardApparience } = useUserContext();
	const toast = useToast();
  const id = "grupo-toast";

	const [inputValueNombreGrupo, setinputValueNombreGrupo] = useState('');
	const [inputDescripcionGrupo, setinputDescripcionGrupo] = useState('');
  const [touchedNombreGrupo, setTouchedNombreGrupo] = useState(false);

	const [showNombreError, setShowNombreError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { loggedUser, userToken } = useUserContext();
	
	const handleInputChangeNombreGrupo = (inputValueNombreGrupo) => {
		setinputValueNombreGrupo(inputValueNombreGrupo);
		setShowNombreError(isEmptyInput(inputValueNombreGrupo));
		setTouchedNombreGrupo(true);
	};

	const handleInputChangeDescripcionGrupo	= (inputValueDescripcionGrupo) => {
		setinputDescripcionGrupo(inputValueDescripcionGrupo);
	}; 

	const handleSendData = async () => {
		try {
			const response = await crearGrupoUsuario(loggedUser, inputValueNombreGrupo, inputDescripcionGrupo, userToken);
			setIsLoading(true)
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Grupo creado correctamente'}
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
		if(inputValueNombreGrupo === ''){
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'No has introducido un nombre de grupo.\nIntentalo de nuevo.'}
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
				appBarTitle={"Crear grupo"} 
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
            Informacion del grupo
          </Text>

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeNombreGrupo}
					value={inputValueNombreGrupo}
					mode="outlined"
					label="Nombre del grupo"
					placeholder="Ingrese nombre del grupo"
					error={touchedNombreGrupo && isEmptyInput(inputValueNombreGrupo)}
					right={<TextInput.Icon icon='account-group'/>}
					keyboardAppearance={keyboardApparience}
				/>
				{showNombreError && (
					<HelperText type="error" style={styles.helperText}>
						Debe ingresar un nombre de grupo
					</HelperText>
				)}

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeDescripcionGrupo}
					value={inputDescripcionGrupo}
					mode="outlined"
					label="Descripcion"
					placeholder="Ingrese una descripcion"
					right={<TextInput.Icon icon='text'/>}
					keyboardAppearance={keyboardApparience}
				/>				
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


export default withTheme(CrearGrupo);