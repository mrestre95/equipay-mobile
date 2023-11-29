import React from "react";
import { View, StyleSheet, Image, ImageBackground  } from 'react-native';
import { Button, withTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const IniciarSesion = ( {theme}) => {
	
	const navigation = useNavigation();

    return (
			<ImageBackground style={styles.container} source={require('../assets/images/homee.png') }>
				<View style={styles.container}>
					<Image
						style={styles.image}
						source={require('../assets/images/home5.png')}
					/>
					<Button 
						mode="contained" 
						style={styles.button} 
						labelStyle={{fontSize:16}} 
						onPress={() => navigation.navigate('LoginForm')} 
					>
						Iniciar Sesion
					</Button>
					<Button 
						mode="contained-tonal" 
						style={styles.button} 
						labelStyle={{fontSize:16, color:'white'}}
						buttonColor='#263338'
						onPress={() => navigation.navigate('RegistroUsuario')}
					>
						Registrarse
					</Button>
				</View>
			</ImageBackground>
    )
}

const styles = StyleSheet.create({
	container: {
		flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
	button:{
		width:330,
		height:45,
		margin:8,
	},
	image:{
		width:360,
		height:360,
		marginBottom:40
	}
});

export default withTheme(IniciarSesion);