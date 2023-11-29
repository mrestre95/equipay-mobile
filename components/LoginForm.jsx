import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext';
import { useToast } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TopBar from "./TopBar";
import ErrorMessage from "./ErrorMessage";
import {
  TextInput,
  HelperText,
  Button,
  Text,
  withTheme,
} from 'react-native-paper';
import { iniciarSesion } from "../apis/authControllerAPI";

const LoginForm = ({ theme }) => {
	const navigation = useNavigation();
	const toast = useToast();
	const id = "login-toast";
	const { keyboardApparience, expoPushToken, processUserToken } = useUserContext();

	const [inputValueEmail, setinputValueEmail] = useState("");
	const [inputValuePass, setinputValuePass] = useState("");
	const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPass, setTouchedPass] = useState(false);
	const [showEmailError, setEmailError] = useState(false);
  const [showPasswordError, setPasswordError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);


	const handleInputChangeEmail = (inputValueEmail) => {
		setinputValueEmail(inputValueEmail);
		setTouchedEmail(true);
		setEmailError(isEmptyInput(inputValueEmail));

	};
	const handleInputChangePass = (inputValuePass) => {
		setinputValuePass(inputValuePass);
		setTouchedPass(true);
		setPasswordError(isEmptyInput(inputValuePass));
	};

	useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      toast.closeAll()
    });
    return unsubscribe;
  }, [navigation]);


	const login = async () => {
		try {
			setIsLoading(true);
			const response = await iniciarSesion(inputValueEmail, inputValuePass, expoPushToken);
			if (response === 'El usuario o la contraseña ingresada no son correctos, vuelva a intentarlo.'){
				if(!toast.isActive(id)){
					toast.show({
						render: () => (
							<ErrorMessage
								message={response}
								type={"error"}
							/>
						),
						id,
						placement: "bottom",
						avoidKeyboard: true
					})
				}
			}
			else{
				processUserToken(response);
				navigation.navigate("NavigationBar");
			}
		} 
		catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Si la respuesta contiene datos, imprime el cuerpo de la respuesta
        console.log('Cuerpo de la respuesta de error:', error.response.data);
      }
    } 
		finally {
			setIsLoading(false);
		}
	};

	const handlePress = () => {
		if(inputValueEmail === '' || inputValuePass === ''){
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Debes introducir email y contraseña. Intentalo de nuevo.'}
          />
				),
				id,
				placement: "bottom",
				avoidKeyboard: true
			});
		}
		else{
			toast.closeAll()
			login()
		}
	}

	const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}
	
	return (
		<View style={styles.containerMain}>
			<TopBar 
				appBarTitle={"Iniciar sesion"} 
				showBackAction={true} 
				mode={"center-aligned"}
			/>
			<KeyboardAwareScrollView
				contentContainerStyle={styles.containerSecondary}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
				keyboardOpeningTime={0}
				extraScrollHeight={100}
      >
				<View style={{alignItems:"center"}}>
					<Image
						style={styles.image}
						source={require('../assets/images/login.png')}
					/>
				</View>
      	<Text
          style={[styles.heading, { color: theme.colors.onBackground, fontWeight:'bold' }]}
          variant="headlineLarge"
        >
          Let's Sign In
        </Text>

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeEmail}
					value={inputValueEmail}
					mode="outlined"
					label="Correo electronico"
					placeholder="Ingrese su email"
					error={showEmailError}
					right={<TextInput.Icon icon='email'/>}
					keyboardAppearance={keyboardApparience}
				/>
				{showEmailError && (
					<HelperText 
						type="error" 
						style={styles.helperText}
					>
					Debe ingresar un email
					</HelperText>
				)}
				
				<TextInput
					style={styles.button}
					onChangeText={handleInputChangePass}
					value={inputValuePass}
					mode="outlined"
					label="Contraseña"
					placeholder="Ingrese su contraseña"
					error={showPasswordError}
					right={<TextInput.Icon icon='key-variant'/>}
					keyboardAppearance={keyboardApparience}
					secureTextEntry
				/>
				{showPasswordError && (
					<HelperText 
						type="error" 
						style={styles.helperText}
					>
					Debe ingresar una contraseña
					</HelperText>
				)}

				<View style={styles.linkTextContainer}>
					<TouchableOpacity 
						onPress={() => navigation.navigate('RecoveryPasswordForm')}
					>
						<Text 
							style={{color:theme.colors.primary}}
							variant="titleSmall"
						>
							¿Olvidaste tu contraseña?
						</Text>
					</TouchableOpacity>
				</View>
					<Button 
						mode="contained" 
						style={styles.buttonConfirm} 
						labelStyle={{fontSize:16}} 
						onPress={handlePress}
						loading={isLoading}
						disabled={isLoading}
					>
						Iniciar sesion
					</Button>
			<SafeAreaView style={styles.footer}>
				<Text 
					variant="titleSmall"
					style={{color:theme.colors.outline}}
				>
					¿No tienes una cuenta?
				</Text>
					<TouchableOpacity 
						onPress={() => navigation.navigate('RegistroUsuario')}
					>
						<Text 
							style={{color: theme.colors.primary, marginLeft: 4}}
							variant="titleSmall"
						>
							Registrate
						</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</KeyboardAwareScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
  containerMain: {
		flex:1,
	},
	containerSecondary: {
    flex: 1,
    marginHorizontal: 15,
	},
	linkTextContainer:{
		alignItems:"flex-end",
	},
	footer:{
		flex:1,
		flexDirection:"row",
		alignItems:"flex-end",
		justifyContent:"center",
	},
	button:{
    justifyContent: "center",
    marginVertical: 8,
	},
	buttonConfirm:{
		height:45,
		marginTop:30
	},
	heading: {
    marginVertical:5,
		marginTop:-30
  },
	helperText: {
    marginTop: -10,
    marginBottom: -5,
	},
	image:{
		width:340,
		height:340,
	}
});


export default withTheme(LoginForm);