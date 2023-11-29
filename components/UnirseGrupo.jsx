import React from "react";
import TopBar from "./TopBar";
import { TextInput, HelperText, withTheme, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../contexts/UserContext'
import { useToast } from "native-base";
import ErrorMessage from "./ErrorMessage";
import {unirseGrupo} from "../apis/grupoControllerAPI"

const UnirseGrupo = ({theme}) => {
	const navigation = useNavigation();
	const { loggedUser, userToken, keyboardApparience } = useUserContext();
	const toast = useToast();
  const id = "grupo-toast";

	const [inputValueCodigoGrupo, setinputValueCodigoGrupo] = useState('');
  const [toucheCodigoGrupo, setTouchedCodigoGrupo] = useState(false);

	const [showCodigoError, setCodigoError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	
	const handleInputChangeCodigoGrupo = (inputValueCodigoGrupo) => {
		setinputValueCodigoGrupo(inputValueCodigoGrupo);
		setCodigoError(isEmptyInput(inputValueCodigoGrupo));
		setTouchedCodigoGrupo(true);
	};
	
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      toast.closeAll()
    });
    return unsubscribe;
  }, [navigation]);

	const handleUnirseGrupo = async () => {
    try {
      setIsLoading(true)
      const response = await unirseGrupo(loggedUser, inputValueCodigoGrupo, userToken);
			navigation.navigate('NavigationBar')
			if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={response}
						type={response === "Se ha unido al grupo correctamente" ? "success" : "error"}
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
		if(inputValueCodigoGrupo === ''){
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'No has introducido un codigo de grupo.\nIntentalo de nuevo.'}
          />
				),
        id,
				placement: "bottom",
        avoidKeyboard: true
			});
		}
		else{
      toast.closeAll()
			handleUnirseGrupo()
    }
	}

	const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}
	
	return (
		<View>
			<TopBar 
				appBarTitle={"Unirse a grupo"} 
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
            Codigo del grupo
          </Text>

				<TextInput
					style={styles.button}
					onChangeText={handleInputChangeCodigoGrupo}
					value={inputValueCodigoGrupo}
					mode="outlined"
					label="Codigo"
					placeholder="Ingrese codigo del grupo"
					error={toucheCodigoGrupo && isEmptyInput(inputValueCodigoGrupo)}
					right={<TextInput.Icon icon='qrcode-plus'/>}
					keyboardAppearance={keyboardApparience}
				/>
				{showCodigoError && (
					<HelperText type="error" style={styles.helperText}>
						Debe ingresar un codigo de grupo
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


export default withTheme(UnirseGrupo);