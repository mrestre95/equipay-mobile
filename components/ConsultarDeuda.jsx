import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback} from 'react-native';
import { Text, withTheme, ActivityIndicator, Divider } from 'react-native-paper';
import TopBar from "./TopBar";
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import ListSugerencias from "./ListSugerencias";
import { getDeudasUsuarioGrupo } from "../apis/deudaControllerApi";
import EmptyList from "./EmptyList";
import { useUserContext } from "../contexts/UserContext";

const ConsultarDeuda = ({theme}) => {

  const navigation = useNavigation();
  const route = useRoute();
  const groupData  = route.params;
  const isFocused = useIsFocused();

  const screenHeight = Dimensions.get('window').height;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [deudaEnPesos, setDeudaEnPesos] = useState([]);
  const [deudaEnDolares, setDeudaEnDolares] = useState([]);
  const [existenDeudas, setExistenDeudas] = useState(false)
  const [sugerencias, setSugerencias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { loggedUser, userToken } = useUserContext();

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    if(contentHeight > screenHeight - 340) //Esto por diferencia entre tamanios de pantalla en IOS y android
      setScrollEnabled(true)
    else
      setScrollEnabled(false)
  };

  const getDeudas = async () => {
    try {
      setIsLoading(true);
      const response = await getDeudasUsuarioGrupo(loggedUser, groupData.id, userToken);
      if(response.deudas.length === 0){
        setExistenDeudas(false);
      }
      else if (response.deudas.length === 1) {
        const sugerencias = response.deudas[0].sugerencias
        const deudas = response.deudas
        if(deudas[0].deudaEnGrupo <= 0){
          setExistenDeudas(false)
     
        }
        else{
          const deudasEnPesos = [];
          const deudasEnDolares = [];
    
          deudas.forEach((deuda) => {
            if (deuda.moneda === "USD") {
              deudasEnDolares.push(deuda);
            } 
            else if (deuda.moneda === "UYU") {
              deudasEnPesos.push(deuda);
            }
          });
          setDeudaEnPesos(deudasEnPesos);
          setDeudaEnDolares(deudasEnDolares);
          setSugerencias(sugerencias);
          if(deudaEnPesos.length != 0 && deudaEnDolares.length != 0){
            
            if(deudasEnPesos[0].deudaEnGrupo <= 0 && deudasEnDolares[0].deudaEnGrupo <= 0){
              setExistenDeudas(false)
            }
          else if(deudaEnPesos.length != 0 && deudaEnDolares.length === 0){
            if(deudasEnPesos[0].deudaEnGrupo <= 0 )
              setExistenDeudas(false)
            }
          else{
            if(deudasEnDolares[0].deudaEnGrupo <= 0 )
              setExistenDeudas(false)
            }
          }
          else{
            setExistenDeudas(true)
          }
        }
      }
      else {
        const sugerencias = response.deudas[0].sugerencias.concat(response.deudas[1].sugerencias);
        const deudas = response.deudas
  
        const deudasEnPesos = [];
        const deudasEnDolares = [];
  
        deudas.forEach((deuda) => {
          if (deuda.moneda === "USD") {
            deudasEnDolares.push(deuda);
          } 
          else if (deuda.moneda === "UYU") {
            deudasEnPesos.push(deuda);
          }
        });
        setDeudaEnPesos(deudasEnPesos);
        setDeudaEnDolares(deudasEnDolares);
        setSugerencias(sugerencias);
        if(deudasEnPesos[0].deudaEnGrupo <= 0 && deudasEnDolares[0].deudaEnGrupo <= 0){
          setExistenDeudas(false)
      }
        else
          setExistenDeudas(true)
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
  }

  useEffect(() => {
    if (isFocused) { 
      getDeudas();
    }
  }, [isFocused]);

  const handleItemPress = (groupId,groupName,idRealiza,idRecibe,monto,nombre,moneda) => {
    const data = {
      groupId: groupId,
      groupName: groupName,
      idRealiza: idRealiza,
      idRecibe: idRecibe,
      monto: monto,
      nombre: nombre,
      moneda: moneda,
    };
    navigation.navigate('RealizarPago', data);
  };

	return (
		<View style={styles.containerMain}>
			<TopBar
				appBarTitle={"Consulta de deudas"} 
				mode={"center-aligned"}
				showBackAction={true}
				actionIconColor={theme.colors.primary}
			/>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            size={'large'}
          />
        </View>
       ) : (
          existenDeudas ? (
          <View style={styles.container}>
            <View style={styles.resume}>
              <Text
                style={{color: theme.colors.onBackground, fontWeight:"bold"}}
                variant="titleMedium"
              >
                Total de deuda en pesos
              </Text>
              <Text
                style={{color: theme.colors.error, fontWeight:"bold", marginLeft:7}}
                variant="titleMedium"
              >
                {deudaEnPesos.length !== 0 ? new Intl.NumberFormat('es-UY', { style: 'currency', currency: deudaEnPesos[0].moneda}).format(deudaEnPesos[0].deudaEnGrupo) : "$ 0,00"}
              </Text>
            </View>
            <View style={styles.resume}>
              <Text
                  style={{color: theme.colors.onBackground, fontWeight:"bold"}}
                  variant="titleMedium"
                >
                  Total de deuda en dolares
                </Text>
                <Text
                  style={{color: theme.colors.error, fontWeight:"bold", marginLeft:7}}
                  variant="titleMedium"
                >
                  {deudaEnDolares.length !== 0 ? new Intl.NumberFormat('es-UY', { style: 'currency', currency: deudaEnDolares[0].moneda}).format(deudaEnDolares[0].deudaEnGrupo) : "US$ 0,00"}
              </Text>
            </View>
            <Divider style={{marginTop:10}}/>
            <Text
              style={{color: theme.colors.onBackground, marginTop:30, marginBottom:10}}
              variant="titleSmall"
            >
              Sugerencias de pago
            </Text>
            <ScrollView
              style={{ maxHeight: screenHeight - 350 }}
              onContentSizeChange={onContentSizeChange}
              scrollEnabled={scrollEnabled}
            >
              {sugerencias.map((item, index) => (
                <View key={index}>
                  <ListSugerencias
                    action={() =>handleItemPress(groupData.id, groupData.nombre, loggedUser, item.usuario.correo, item.monto, item.usuario.nombre, item.moneda)}
                    content={`${item.usuario.nombre} ${item.usuario.apellido}`}
                    monto={
                      item.moneda === 'UYU' ? new Intl.NumberFormat('es-UY', { style: 'currency', currency: "UYU"}).format(item.monto) 
                      : 
                      new Intl.NumberFormat('es-UY', { style: 'currency', currency: "USD"}).format(item.monto)
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
          ) : (
            <View style={styles.containerEmpty}>
              <EmptyList
                image={'smile'}
                addButton
                buttonName={"Volver"}
                message={"Parece que aun no tienes deudas con el grupo"}
                action={() => navigation.navigate('NavigationBar')}
              />
              </View>  
)
       )}
		</View>
	)
}

const styles = StyleSheet.create({
  containerMain: {
    flex:1
  },
	container: {
		marginHorizontal:15,
    marginVertical:10
  },
  containerEmpty:{
    flex:1, 
    alignItems:"center",
    justifyContent:"center"
  },
  resume:{
    justifyContent:"flex-start", 
    flexDirection:"row", 
    marginVertical:3
  },
  loadingContainer:{
		flex:1,
		justifyContent:"center",
		alignItems:"center"
	}
});


export default withTheme(ConsultarDeuda);