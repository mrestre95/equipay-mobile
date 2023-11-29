import React from "react";
import TopBar from "./TopBar";
import { TextInput, HelperText, Button, withTheme, Text, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, View, Image } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useToast } from "native-base";
import { useUserContext } from '../contexts/UserContext'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ErrorMessage from "./ErrorMessage";
import { enviarMail } from "../apis/authControllerAPI";


const RecoveryPasswordForm = ({ theme }) => {
	const { keyboardApparience } = useUserContext();
	const toast = useToast();
	const id = "recovery-toast";

	const navigation = useNavigation();

	const [inputValueEmail, setinputValueEmail] = useState("");
	const [touchedEmail, setTouchedEmail] = useState(false);
	const [isLoading, setIsLoading] = useState(false);


	const handleInputChangeEmail = (inputValueEmail) => {
		setinputValueEmail(inputValueEmail);
		setTouchedEmail(true);
	};

	useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      toast.closeAll()
    });
    return unsubscribe;
  }, [navigation]);

	const sendEmail = async () => {
    try {
      setIsLoading(true)
      const response = await enviarMail(inputValueEmail);
			navigation.navigate("IniciarSesion")
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Se ha enviado un mail para restablecer su contraseña'}
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
      setIsLoading(false);
    }
  }

	const handlePress = () => {
		if(inputValueEmail === ''){
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
						message={'No has introducido una direccion de correo electronico. Intentalo de nuevo.'}
					/>
				),
				id,
				placement: "bottom",
				avoidKeyboard: true
			});
		}
		else{
			toast.closeAll()
			sendEmail()
		}
	}

	const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}

    return (
		<View style={styles.container}>
			<TopBar 
				appBarTitle={"Restablecer contraseña"} 
				showBackAction={true} 
				mode={"center-aligned"}
			/>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true}
            size={'large'}
          />
        </View>
      ) : (  
			
			<KeyboardAwareScrollView
				contentContainerStyle={styles.formContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
				keyboardOpeningTime={0}
				extraScrollHeight={100}
      >
				<View style={{alignItems:"center"}}>
						<Image
							style={styles.image}
							source={require('../assets/images/resetpwd.png')}
						/>
					</View>

				<Text
					style={[styles.heading, { color: theme.colors.onBackground, fontWeight:'bold', marginTop:25 }]}
					variant="headlineLarge"
				>
					Recuperar contraseña 
				</Text>
				<Text
					style={[styles.heading, { color: theme.colors.outline }]}
					variant="titleMedium"
				>
					Ingresa tu email para solicitar una nueva contraseña
				</Text>

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeEmail}
					value={inputValueEmail}
					mode="outlined"
					label="Correo electronico"
					placeholder="Ingrese su email"
					error={touchedEmail && isEmptyInput(inputValueEmail)}
					right={<TextInput.Icon icon='email'/>}
					keyboardAppearance={keyboardApparience}
				/>
				<HelperText 
					type="error" 
					style={styles.helperText} 
					visible={touchedEmail && isEmptyInput(inputValueEmail)}
				>
					Debe ingresar un email
				</HelperText>
			
				<Button 
					mode="contained" 
					style={styles.buttonConfirm} 
					labelStyle={{fontSize:16}} 
					onPress={handlePress}
				>
					Enviar
				</Button>
			</KeyboardAwareScrollView>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
  container: {
		flex:1
  },
	formContainer: {
    flex: 1,
    marginHorizontal: 15,
	},
	loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonConfirm: {
    height: 45,
    marginVertical: 15,
  },
  heading: {
    marginTop: 10,
  },
  helperText: {
    marginTop: -10,
    marginBottom: -5,
  },
	image:{
		width:260,
		height:260,
	}

});

export default withTheme(RecoveryPasswordForm);