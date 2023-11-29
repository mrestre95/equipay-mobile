import React, {useState, useEffect} from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Divider, Avatar, IconButton, withTheme, ActivityIndicator } from 'react-native-paper';
import TopBar from './TopBar';
import MenuOption from './MenuOption';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext';
import { eliminarUsuario, getUsuario } from '../apis/usuarioControllerAPI';
import {images} from './Images'
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';
import { logout } from '../apis/authControllerAPI';


const Perfil = ({ theme }) => {

	const navigation = useNavigation();
	const isFocused = useIsFocused();

	const { setLoggedUser, setUserToken, loggedUser, userToken } = useUserContext(); 
	const [userName, setUserName] = useState('');
	const [userLastName, setUserLastName] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);


	const salir = async () => {
    try {
      const response = await logout(loggedUser, userToken)
    } 
    catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Si la respuesta contiene datos, imprime el cuerpo de la respuesta
        console.log('Cuerpo de la respuesta de error:', error.response.data);
      }
    }
  }

	const cerrarSesion = () => {
		salir()
		setLoggedUser("")
		setUserToken("")
		navigation.navigate("IniciarSesion")
	}

	const handlePressCerrarSesion = () => {
    Alert.alert('Cerrar sesion', '¿Esta seguro que quiere cerrar sesion?', [
      {
				text: 'Cerrar sesion', 
				onPress: cerrarSesion,
				style: 'destructive',

			},
			{
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }
    ]);
	}

	const handlePressEditarPerfil = () => {
		const datos = {
			nombre: userName,
			apellido: userLastName,
			email: userEmail
		}

		navigation.navigate('EditProfile', datos)
	}

	const deleteUser = async () => {
    try {
      setIsLoading(true)
      const usuario = await eliminarUsuario(loggedUser, userToken);
    } 
    catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Si la respuesta contiene datos, imprime el cuerpo de la respuesta
        console.log('Cuerpo de la respuesta de error:', error.response.data);
      }
    } 
    finally {
      setIsLoading(false)
    }
  }

	const eliminarCuenta = () => {
		deleteUser()
		cerrarSesion()
	}

	const handlePressEliminarCuenta = () =>  {
		Alert.alert('Eliminar cuenta', '¿Esta seguro que quieres eliminar tu cuenta?', [
      {
				text: 'Confirmar', 
				onPress: eliminarCuenta,
				style: 'destructive',

			},
			{
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }
    ]);
	}

	const getInfoUsuario = async () => {
    try {
      setIsLoading(true)
      const usuario = await getUsuario(loggedUser, userToken);

			setUserName(usuario.nombre)
			setUserLastName(usuario.apellido)
			setUserEmail(usuario.correo)

    } 
    catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // Si la respuesta contiene datos, imprime el cuerpo de la respuesta
        console.log('Cuerpo de la respuesta de error:', error.response.data);
      }
    } 
    finally {
      setIsLoading(false)
    }
  }

	useEffect(() => {
    if (isFocused) { 
      getInfoUsuario();
    }
  }, [isFocused]);

    return (
			<View style={{ flex: 1 }}>
				<TopBar 
					appBarTitle={"Perfil"} 
					mode={"center-aligned"}
				/>
				{!isLoading ? (
					<ScrollView>
						<View style={styles.containerPrincipal}>
							<View style={styles.containerHeader}>
								<Avatar.Image 
									size={130} 
									style={styles.avatar} 
									source={images[asignarIndiceSegunPrimeraLetra(userName)]}
									/>
								<IconButton
									icon="camera"
									size={17}
									style={styles.cameraButton}
									mode='contained-tonal'								
								/>
								<View style={styles.containerData}>
									<Text 
										style={styles.heading}
										variant="titleLarge"
									>
										{`${userName} ${userLastName}`}
									</Text>
									<Text 
										style={styles.subHeading}
										variant="titleSmall"
									>
										{userEmail}
									</Text>								
									<Button
										mode='contained-tonal'
										style={{width:130, borderRadius:10}}
										contentStyle={{flexDirection: 'row-reverse'}}
										icon="pencil"
										onPress={handlePressEditarPerfil}
									>
										Editar Perfil
									</Button>
								</View>
							</View>
							<MenuOption 
								iconName={'heart-outline'} 
								buttonName={'Favoritos'}
								color={theme.colors.onBackground}
							/>
							<MenuOption 
								iconName={'arrow-down'} 
								buttonName={'Descargas'}
								color={theme.colors.onBackground}
							/>				
							<Divider 
								style={{width:'88%'}}
							/>
							<MenuOption 
								iconName={'globe-outline'} 
								buttonName={'Lenguaje'}
								color={theme.colors.onBackground}
							/>						
							<MenuOption 
								iconName={'location-outline'} 
								buttonName={'Ubicacion'}
								color={theme.colors.onBackground}
							/>												
							<MenuOption 
								iconName={'scan-outline'} 
								buttonName={'Pantalla'}
								color={theme.colors.onBackground}
							/>	
							<MenuOption 
								iconName={'wallet-outline'} 
								buttonName={'Billetera'}
								color={theme.colors.onBackground}
							/>	
							<Divider 
								style={{width:'88%'}}
							/>
							<MenuOption 
								iconName={'trash-outline'} 
								buttonName={'Eliminar cuenta'}
								color={theme.colors.error}
								action={handlePressEliminarCuenta}
							/>														
							<MenuOption 
								iconName={'log-out-outline'} 
								buttonName={'Cerrar sesion'}
								color={theme.colors.error}
								action={handlePressCerrarSesion}
							/>
						</View>
					</ScrollView>
				):(
					<View style={styles.loadingContainer}>
						<ActivityIndicator 
							animating={true} 
							size={'large'} 
						/>
					</View>
				)}	
			</View>
		)
	}

	const styles = StyleSheet.create({
		containerPrincipal: {
			flex:1,
			justifyContent: 'space-around',
			alignItems: 'flex-start',
			flexDirection:'row',
			flexWrap:'wrap'
		},
		containerHeader:{
			flex:1,
			flexDirection:'row',
			marginVertical:15,
			marginHorizontal:15
		},
		containerData:{
			flexDirection:'column',
			justifyContent:'center',
			alignContent:'center',
			marginHorizontal:15,
		},
		loadingContainer:{
			flex:1,
			justifyContent:"center",
			alignItems:"center"
		},
		avatar:{
			width:130,	
			height:130,
		},
		imageView:{
			justifyContent:'flex-start',
			alignItems:'flex-start',
		},
		heading:{
			fontWeight:'300'
		},
		subHeading:{
			marginBottom:22,
			fontWeight:'300',
			color:'grey'
		},
		listItem:{
			borderWidth:1, 
			flexDirection:'row',
			alignItems:'center',
			margin:15,
		},
		cameraButton: {
			position: 'absolute',
			top: 97, 
			right: 241,
		}
	});

	export default withTheme(Perfil);
