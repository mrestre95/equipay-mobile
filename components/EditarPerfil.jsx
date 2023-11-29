import React, { useState, useEffect } from "react";
import { View, StyleSheet} from 'react-native';
import { Text, Avatar, IconButton, TextInput, withTheme, HelperText, ActivityIndicator } from 'react-native-paper';
import TopBar from "./TopBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; 
import { useUserContext } from '../contexts/UserContext'
import { modificarUsuario, getUsuario } from "../apis/usuarioControllerAPI";
import { useToast } from "native-base";
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import ErrorMessage from "./ErrorMessage";
import {images} from './Images'
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';


const EditarPerfil = ({theme}) => {
	const { keyboardApparience, loggedUser, userToken } = useUserContext();
	const navigation = useNavigation();
	const toast = useToast();
  const id = "grupo-toast";
	const route = useRoute();
  const datos  = route.params;

	const [inputNombre, setInputNombre] = useState(datos.nombre)
  const [inputApellido, setInputApellido] = useState(datos.apellido);
  const [inputPassword, setInputPassword] = useState('');
	const [inputEmail, setInputEmail] = useState(datos.email);

	const [showNombreError, setShowNombreError] = useState(false);
  const [showApellidoError, setShowApellidoError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

	const [isLoading, setIsLoading] = useState(false);


	const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}

	const handleInputChangeNombre = (inputNombre) => {
		setInputNombre(inputNombre);
		setShowNombreError(isEmptyInput(inputNombre));
	};

	const handleInputChangeApellido = (inputApellido) => {
		setInputApellido(inputApellido);
		setShowApellidoError(isEmptyInput(inputApellido));
	};

	const handleInputChangePassword = (inputPassword) => {
		setInputPassword(inputPassword);
		setShowPasswordError(isEmptyInput(inputPassword));
	};

	const modificarPerfil = async () => {
    try {
      const response = await modificarUsuario(loggedUser, inputNombre, inputApellido, inputPassword, userToken);
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Perfil actualizado correctamente'}
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
    } 
    finally {
    }
  }

	const handlePressConfirm = () => {
		if(inputNombre === '' || inputApellido === '' || inputPassword === ''){
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Debes completar todos los campos antes de continuar.'}
          />
				),
        id,
				placement: "bottom",
        avoidKeyboard: true
			});
		}
		else{
      toast.closeAll()
			modificarPerfil()
			navigation.navigate('NavigationBar')
    }
	}

	return (
		<View style={styles.containerMain}>
			<TopBar
				appBarTitle={"Editar Perfil"} 
				mode={"center-aligned"}
				showBackAction={true}
				action={handlePressConfirm}
				actionIcon={'check'}
				actionIconColor={theme.colors.primary}
			/>
			{!isLoading ? (
				<KeyboardAwareScrollView
					resetScrollToCoords={{ x: 0, y: 0 }}
					scrollEnabled={true}
					enableOnAndroid={true}
					enableAutomaticScroll={true}
					keyboardOpeningTime={0}
					extraScrollHeight={110}
				>
				<View style={styles.containerImage}>
					<Avatar.Image 
						size={130} 
						style={styles.avatar} 
						source={images[asignarIndiceSegunPrimeraLetra(inputNombre)]} 
					/>
					<IconButton
						icon="camera"
						size={17}
						style={styles.cameraButton}
						mode='contained-tonal'
						onPress={() => navigation.navigate('EditProfile')}
					/>
				</View>
				<View style={styles.containerHeading}>
					<Text 
						style={styles.heading}
						variant="titleSmall"
					>
						Informacion Personal
					</Text>
				</View>
				<View style={styles.container}>
					<TextInput
							style={styles.button}
							//onChangeText={handleInputChangeEmail}
							value={inputEmail}
							mode="outlined"
							label="Email"
							placeholder="Email"
							disabled
							keyboardAppearance={keyboardApparience}
							// error={touchedEmail && isEmptyInput(inputValueEmail)}
						/>
						<TextInput
							style={styles.button}
							onChangeText={handleInputChangeNombre}
							value={inputNombre}
							mode="outlined"
							label="Nombre"
							placeholder="Nombre"
							keyboardAppearance={keyboardApparience}
							error={showNombreError}
						/>
							{showNombreError && (
								<HelperText type="error" style={styles.helperText}>
									Debe ingresar un nombre
								</HelperText>
							)}				
						<TextInput
							style={styles.button}
							onChangeText={handleInputChangeApellido}
							value={inputApellido}
							mode="outlined"
							label="Apellido"
							placeholder="Apellido"
							keyboardAppearance={keyboardApparience}
							error={showApellidoError}
						/>
							{showApellidoError && (
								<HelperText type="error" style={styles.helperText}>
									Debe ingresar un apellido
								</HelperText>
							)}					
						<TextInput
							style={styles.button}
							onChangeText={handleInputChangePassword}
							value={inputPassword}
							mode="outlined"
							label="Password"
							placeholder="Password"
							keyboardAppearance={keyboardApparience}
							secureTextEntry
							error={showPasswordError}
						/>
						{showPasswordError && (
							<HelperText type="error" style={styles.helperText}>
								Debe ingresar un una contraseña
							</HelperText>
						)}								
					</View>
				</KeyboardAwareScrollView>
			) : (
				<View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size={'large'} />
      </View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	containerMain: {
		flex:1,
	},
	container: {
		marginHorizontal:15,
	},
	containerImage:{
		alignItems:"center",
		justifyContent:"center",
		flexDirection:'row',
		marginVertical:15,
	},
	containerHeading:{
		justifyContent:"flex-start",
		alignItems:"flex-start",
		marginHorizontal:15,
		marginTop:5,
		marginBottom:-8
	},
	avatar:{
		width:130,	
		height:130,
	},
	heading:{
		marginBottom:5
	},
	button:{
		width:"100%",
		justifyContent:"center",
		height:45,
		marginVertical:8,
		borderRadius:10
	},
	buttonMargin: {
    marginVertical: 11, // Agregar este estilo para el margen
  },
	cameraButton: {
		position: 'absolute',
		top: 97, 
		right: 138,
	},
	helperText: {
		marginTop:-10,
		marginBottom:-5,
  },
	loadingContainer:{
		flex:1,
		justifyContent:"center",
		alignItems:"center"
	}

});


export default withTheme(EditarPerfil);