import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Text, withTheme, Avatar, TextInput, Button, HelperText } from 'react-native-paper';
import { useToast } from "native-base";
import TopBar from "./TopBar";
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { asignarIndiceSegunPrimeraLetra } from './RandomImageURL';
import {images} from './Images'
import ErrorMessage from "./ErrorMessage";
import { agregarPago } from "../apis/pagoControllerAPI";
import { useUserContext } from "../contexts/UserContext";

const RealizarPago = ({theme}) => {

  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast()

  const id = "grupo-toast";
  const data  = route.params;
  const index = asignarIndiceSegunPrimeraLetra(data.nombre)
  const index2 = asignarIndiceSegunPrimeraLetra(data.idRealiza)

  const [inputMonto, setInputMonto] = useState(data.monto);
  const [inputMoneda, setInputMoeda] = useState(data.moneda);
  const [showMontoError, setShowMontoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loggedUser, userToken } = useUserContext();

  const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}

  const handleSendData = async () => {
    const date = new Date()
		try {
      setIsLoading(true)
			const response = await agregarPago(inputMonto, inputMoneda, date, data.groupId, data.idRealiza, data.idRecibe, userToken);
      const confirmationScreenData = {
        id:'pago',
        heading: 'Genial !',
        content: 'Tu pago se ha realizado correctamente',
        buttonName: 'Volver',
        groupId: data.groupId,
        groupName: data.groupName
      }
      navigation.navigate('ConfirmationScreen', confirmationScreenData)
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

  const handleInputMonto = (inputMonto) => {
    setInputMonto(inputMonto)
    setShowMontoError(isEmptyInput(inputMonto) || inputMonto > data.monto);
  }

  const handlePress = () => {
    if(inputMonto === '' || inputMonto > data.monto){
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={`Ingrese un monto menor o igual a ${inputMoneda} ${data.monto}`}
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
    }    
  }

	return (
		<View >
			<TopBar
				appBarTitle={"Realizar pago"} 
				mode={"center-aligned"}
				showBackAction={true}
        actionIcon={'close'}
        action = {() => navigation.navigate('DetallesGrupo', groupData = {
          id: data.groupId,
          nombre: data.groupName
        })}
			/>
			<KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
				keyboardOpeningTime={0}
				extraScrollHeight={-150}
      >
        <View style={styles.container}>
          <Avatar.Image
            size={90}
            style={[styles.avatar, { backgroundColor: theme.colors.background }]}
            source={images[index2]}
          />
          <Icon
            name="arrow-right" 
            size={45} 
            color={theme.colors.primary}
          />

          <Avatar.Image
            size={90}
            style={[styles.avatar, { backgroundColor: theme.colors.background }]}
            source={images[index]}
          />        
        </View>
        
        <View style={styles.container2}>
          <View style={styles.container3}>
            <Text 
              style={{color:theme.colors.onBackground}} 
              variant="headlineSmall"
            >
              Tu
            </Text>  
          </View>
          <View style={styles.container3}>
            <Text 
              style={{color:theme.colors.onBackground}} 
              variant="headlineSmall"
            >
              {data.nombre}
            </Text>
          </View>
        </View>
        <Text 
          style={{color:theme.colors.onBackground, marginHorizontal:15, marginVertical:5}} 
          variant="titleSmall"
        >
          Ingrese el monto a pagar
        </Text>  
        <TextInput
          style={styles.button}
          value={inputMoneda}
          mode="outlined"
          label="Moneda"
          placeholder="Moneda"
          keyboardType="numeric"
          disabled
          //keyboardAppearance={keyboardApparience}
          //error={showDescriptionError}
        />

        <TextInput
          style={styles.button}
          onChangeText={handleInputMonto}
          value={inputMonto.toString()}
          mode="outlined"
          label="Monto"
          placeholder="Monto"
          keyboardType="numeric"
          //keyboardAppearance={keyboardApparience}
          error={showMontoError}
        />
        {showMontoError && (
          <HelperText type="error" style={styles.helperText}>
            Ingrese un monto menor o igual a {`${inputMoneda} ${data.monto}`}
          </HelperText>
        )}

        <Button 
          mode="contained" 
          style={styles.buttonConfirm} 
          labelStyle={{fontSize:16}} 
          onPress={handlePress}
        >
          Pagar
        </Button>
      </KeyboardAwareScrollView>     
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal:15,
    marginBottom:20,
    marginTop:60,
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center"
  },
  container2:{
    marginHorizontal:15,
    marginTop:-10,
    marginBottom:50,
    flexDirection:"row",
  },
  container3:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  button:{
    marginHorizontal:15,
    marginVertical:5
  },
  buttonConfirm:{
    marginHorizontal:15,
		height:45,
		marginTop:30
  },
  avatar: {
    width: 90,
    height: 90,
    marginHorizontal:22
  },
  helperText: {
    marginHorizontal:15,
		marginTop:-10,
		marginBottom:-8,
    alignSelf: 'stretch',
	},

});


export default withTheme(RealizarPago);