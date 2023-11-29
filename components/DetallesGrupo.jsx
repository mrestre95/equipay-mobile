import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import { Text, withTheme, Divider, SegmentedButtons, Button, ActivityIndicator } from 'react-native-paper';
import TopBar from "./TopBar";
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import gastosData from '../assets/data/dataGastos.json';
import Icon from 'react-native-vector-icons/Ionicons';
import ListItem from "./ListItem";
import { obtenerGastosGrupo, obtenerPagosGrupo } from "../apis/grupoControllerAPI";
import EmptyList from "./EmptyList";
import { useUserContext } from "../contexts/UserContext";

const DetallesGrupo = ({theme}) => {

  const navigation = useNavigation();
  const route = useRoute();
  const groupData  = route.params;

  const images = {
    spent: require("../assets/images/shopping.png"),
    pay: require("../assets/images/pay.png"),
  };

  const isFocused = useIsFocused();
  const screenHeight = Dimensions.get('window').height;
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [segmentedButtonValue, setSegmentedButtonValue] = useState('gastos');
  const [existenGastos, setExistenGastos] = useState(true);
  const [existenPagos, setExistenPagos] = useState(true);
  const [gastos, setGastos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { loggedUser, userToken } = useUserContext();

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const gastos = await obtenerGastosGrupo(groupData.id, userToken);
      const pagos = await obtenerPagosGrupo(groupData.id, userToken)
      !Object.keys(gastos).length ? (setExistenGastos(false)) : (setExistenGastos(true), setGastos(gastos));
      !Object.keys(pagos).length ? (setExistenPagos(false)) : (setExistenPagos(true), setPagos(pagos));
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
      fetchData();
    }
  }, [isFocused]);

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    if(contentHeight > screenHeight - 340) //Esto por diferencia entre tamanios de pantalla en IOS y android
      setScrollEnabled(true)
    else
      setScrollEnabled(false)
  };

  const totalGastoPorMoneda = (idMoneda) => {
    const sumaPorMoneda = { "UYU": 0, "USD": 0 };

    for (const gasto of gastos) {
      const { monto, moneda } = gasto;

      if (!sumaPorMoneda[moneda]) {
        sumaPorMoneda[moneda] = 0;
      }

      sumaPorMoneda[moneda] += monto;
    }
    if (idMoneda === "UYU")
      return sumaPorMoneda['UYU']

      //return new Intl.NumberFormat('es-UY', { style: 'currency', currency: "UYU" }).format(sumaPorMoneda['UYU']);
    else (idMoneda === "USD")
      return sumaPorMoneda['USD']
      //return new Intl.NumberFormat('es-UY', { style: 'currency', currency: "USD" }).format(sumaPorMoneda['USD']);
  }

  const totalPagosPorMoneda = (idMoneda) => {
    const sumaPorMoneda = { "UYU": 0, "USD": 0 };

    for (const pago of pagos) {
      const { monto, moneda } = pago;

      if (!sumaPorMoneda[moneda]) {
        sumaPorMoneda[moneda] = 0;
      }

      sumaPorMoneda[moneda] += monto;
    }
    if (idMoneda === "UYU")
      return sumaPorMoneda['UYU']
    else (idMoneda === "USD")
      return sumaPorMoneda['USD']
  }

  const balanceGeneral = (idMoneda) => {
    if(idMoneda === 'UYU')
      return new Intl.NumberFormat('es-UY', { style: 'currency', currency: "UYU" }).format(totalGastoPorMoneda('UYU') - totalPagosPorMoneda("UYU"));
    else if(idMoneda === 'USD')
      return new Intl.NumberFormat('es-UY', { style: 'currency', currency: "USD" }).format(totalGastoPorMoneda('USD') - totalPagosPorMoneda("USD"));
    }

  return (
    <View style={styles.container}>
      <TopBar
        appBarTitle={groupData.nombre}
        mode={"center-aligned"}
        showBackAction={true}
        action={() => navigation.navigate("InvitarAmigos", groupData)}
        actionIcon={'share-variant'}
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
        existenGastos ? (
          <>
            <Text
              style={[styles.heading, {color:theme.colors.onBackground}]}
              variant="titleSmall"
            >
              Balance
            </Text>
            <View style={styles.containerBalance}>
              <Text
                style={{color:theme.colors.secondary, marginVertical:5}}
                variant="displayMedium"
              >
                {balanceGeneral('UYU')}
              </Text>
              <Divider style={{width:"70%"}}/>
              <Text
                style={{color:theme.colors.secondary, marginVertical:5}}
                variant="headlineMedium"
              >
                {balanceGeneral('USD')}
              </Text>
            </View>

            <SegmentedButtons
              style={{paddingHorizontal:10}}
              value={segmentedButtonValue}
              onValueChange={setSegmentedButtonValue}
              density="medium"
              buttons={[
                {
                  value: 'gastos',
                  label: 'Gastos',
                  icon: 'currency-usd',
                },
                { 
                  value: 'pagos', 
                  label: 'Pagos',
                  icon: 'credit-card-outline',
                },
              ]}
            />
            {segmentedButtonValue === 'gastos' ? (
              <View>
                <View style={styles.containerHeading}>
                  <Text
                    style={{color: theme.colors.onBackground}}
                    variant="titleSmall"
                  >
                    Detalle de gastos
                  </Text>
                  <Button
                    mode='contained-tonal'
                    icon={() => <Icon name="add" size={18} color={theme.colors.onSecondaryContainer}/>}
                    labelStyle={[styles.labelStyle, {color:theme.colors.onSecondaryContainer}]}
                    contentStyle={styles.contentStyle}
                    onPress={() => navigation.navigate('RegistrarGasto', groupData)}
                  >
                    Add
                  </Button>
                </View>

                <ScrollView
                  style={{ maxHeight: screenHeight - 400 }}
                  onContentSizeChange={onContentSizeChange}
                  scrollEnabled={scrollEnabled}
                >
                  {gastos.map((item, index) => (
                    <View key={item.id}>
                      <ListItem
                        avatarSource={images.spent}
                        content={item.descripcion}
                        date={item.fecha}
                        owner={`${item.cubiertoPor.nombre} ${item.cubiertoPor.apellido}`}
                        spent={new Intl.NumberFormat('es-UY', { style: 'currency', currency: item.moneda}).format(item.monto)}
                        //action={() => navigation.navigate("DetallesGrupo")}
                        color={theme.colors.onBackground}
                        addName={true}
                        addSpent={true}
                        spentColor={theme.colors.error}
                      />
                      {index < gastosData.length - 1 && <Divider key={item.id}/>}
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <View>
                <View style={styles.containerHeading}>
                  <Text
                    style={{color: theme.colors.onBackground}}
                    variant="titleSmall"
                  >
                    Detalle de pagos
                  </Text>
                  <Button
                    mode='contained-tonal'
                    icon={() => <Icon name="add" size={18} color={theme.colors.onSecondaryContainer}/>}
                    labelStyle={[styles.labelStyle, {color:theme.colors.onSecondaryContainer}]}
                    contentStyle={styles.contentStyle}
                    onPress={() => navigation.navigate('ConsultarDeuda', groupData)}
                  >
                    Add
                  </Button>
                </View>
                {existenPagos ? (
                <ScrollView
                  style={{ maxHeight: screenHeight - 400  }}
                  onContentSizeChange={onContentSizeChange}
                  scrollEnabled={scrollEnabled}
                >
                  {pagos.map((item, index) => (
                    <View key={item.id}>
                      <ListItem
                        avatarSource={images.pay}
                        content={`${item.realiza.nombre} ${item.realiza.apellido}`}
                        date={item.fecha}
                        owner={`Recibe - ${item.recibe.nombre} ${item.recibe.apellido}`}
                        spent={new Intl.NumberFormat('es-UY', { style: 'currency', currency: item.moneda}).format(item.monto)}
                        //action={() => navigation.navigate("DetallesGrupo")}
                        color={theme.colors.onBackground}
                        addName={true}
                        addSpent={true}
                        spentColor={theme.colors.primary}
                      />
                      {index < gastosData.length - 1 && <Divider key={item.id}/>}
                    </View>
                  ))}
                </ScrollView>
                ): (
                  <View style={{marginTop:50}}>
                    <EmptyList
                      image={'noData'}
                      buttonName={"Agregar pago"}
                      icon={"plus"}
                      message={"Aun no existen pagos registrados"}
                      action={() => navigation.navigate('ConsultarDeuda', groupData)}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.containerEmpty}>
            <EmptyList 
              image={'noData'}
              addButton
              buttonName={"Agregar gasto"}
              icon={"plus"}
              heading={'Oops!'}
              message={"Aun no existen gastos registrados"}
              action={() => navigation.navigate('RegistrarGasto', groupData)}
            />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  containerEmpty:{
    flex:1, 
    alignItems:"center",
    justifyContent:"center"
  },
  containerBalance:{
    alignItems:"center",
    marginVertical:10,
    marginHorizontal:10,
    paddingTop:10,
    paddingBottom:30,
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading:{
    marginTop:10,
    paddingHorizontal:10,
  },
  containerHeading:{
    marginTop:30,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    paddingHorizontal:10,
  },
  labelStyle:{
    fontSize:13, 
    marginLeft:15, 
    height:'100%', 
    paddingTop:4, 
  },
  contentStyle:{
    justifyContent:'center', 
    alignItems:"center",
    width:75, 
    height:28
  }
});

export default withTheme(DetallesGrupo);
