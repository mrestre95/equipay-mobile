import React, {useState, useEffect} from "react";
import { View, StyleSheet, Dimensions, Keyboard} from 'react-native';
import { Text, TextInput, withTheme, Chip, Divider, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import TopBar from "./TopBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; 
import { useUserContext } from '../contexts/UserContext'
import { useIsFocused, useRoute, useNavigation } from '@react-navigation/native';
import integrantesData from '../assets/data/dataIntegrantes.json';
import ListIntegrantes from "./ListIntegrantes";
import Icon from 'react-native-vector-icons/Ionicons';
import { obtenerCategorias } from "../apis/categoriasControllerAPI";
import { obtenerGrupo } from "../apis/grupoControllerAPI";
import { altaGasto } from "../apis/gastoControllerAPI";
import { useToast } from "native-base";
import ErrorMessage from "./ErrorMessage";
import { useActionSheet } from '@expo/react-native-action-sheet';

const  RegistrarGasto = ({theme}) => {

  const categoryIconMap = {
    "Comida": "food", 
    "Viaje": "airplane",
    "Combustible": "fuel",
    "Alojamiento": "home",
    "Transporte": "train-car",
    "Otros": "clipboard-edit",
    "Supermercado": "shopping",
  }
  
  const images = {
    imageOne: require("../assets/images/rabbit.png"),
    imageTwo: require("../assets/images/avatar.png"),
    imageThree: require("../assets/images/avatar2.png"),
    imageFour: require("../assets/images/avatar4.png"),
    imageFive: require("../assets/images/avatar5.png"),
    imageSix: require("../assets/images/avatar6.png"),
    imageSeven: require("../assets/images/avatar7.png"),
    imageEight: require("../assets/images/avatar8.png"),
  };

  const id = "grupo-toast";
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  const isFocused = useIsFocused();
	const { keyboardApparience, loggedUser, userToken } = useUserContext();
  const { showActionSheetWithOptions } = useActionSheet();

  const groupData = route.params;
  const screenHeight = Dimensions.get('window').height;
  const [selectAll, setSelectAll] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const [inputFormattedDate, setInputFormattedDate] = useState();
  const [inputDate, setInputDate] = useState("");

  const [inputDescription, setInputDescription] = useState("");
	const [inputMonto, setInputMonto] = useState("");
  const [inputMoneda, setInputMoneda] = useState("")
  const [inputCategory, SetInputCategory] = useState("");
  const [inputParticipantes, setInputParticipantes] = useState([]);

  const [touchedDescription, setTouchedDescription] = useState(false);
  const [touchedMonto, setTouchedMonto] = useState(false);
  const [touchedMoneda, setTouchedMoneda] = useState(false);

  const [showDescriptionError, setShowDescriptionError] = useState(false);
  const [showMontoError, setShowMontoError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const [showMonedaError, setShowMonedaError] = useState(false);

  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [participantesGrupo, setParticipantesGrupo] = useState([])


  const getCategorias = async () => {
    try {
      setIsLoading(true)
      const categorias = await obtenerCategorias(userToken);
      setCategorias(categorias)
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

  const getParticipantesGrupo = async () => {
    try {
      const participantes = await obtenerGrupo(groupData.id, userToken);
      setParticipantesGrupo(participantes);
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

  const crearGasto = async () => {
    try {
      const response = await altaGasto(inputMonto, inputMoneda, inputDescription, inputDate, groupData.id, loggedUser, inputParticipantes, inputCategory, userToken);
      if (!toast.isActive(id))
			toast.show({
				render: () => (
					<ErrorMessage
            message={'Gasto ingresado correctamente'}
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

  useEffect(() => {
    if (isFocused) {
      getCategorias();
      getParticipantesGrupo();
  
      // Obtener la fecha actual
      const currentDate = new Date();
      
      // Formatear la fecha actual en el formato "DD/MM/AAAA"
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
  
      setInputDate(currentDate);
      setInputFormattedDate(formattedDate);
    }
  }, [isFocused]); // Escucha cambios en isFocused

  const handlePressConfirm = () => {
		if(inputDescription === '' || inputMonto === '' || inputDate === '' || inputMoneda === '' || inputCategory === '' || inputParticipantes.length === 0){
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
			crearGasto()
			navigation.navigate('DetallesGrupo', groupData)
    }
	}

  const handleInputChangeParticipantes = (correo) => {
    if (!inputParticipantes.includes(correo)) {
      setInputParticipantes([...inputParticipantes, correo]);
    } 
    else {
      setInputParticipantes(inputParticipantes.filter((item) => item !== correo));
    }
  };

  const handleInputChangeDescription = (inputDescription) => {
		setInputDescription(inputDescription);
		setTouchedDescription(true);
		setShowDescriptionError(isEmptyInput(inputDescription));
	};

	const handleInputChangeMonto = (inputMonto) => {
		setInputMonto(inputMonto);
		setTouchedMonto(true);
		setShowMontoError(isEmptyInput(inputMonto));
	};

  const handleInputChangeMoneda = (inputMoneda) => {
		setInputMoneda(inputMoneda);
		setTouchedMoneda(true);
		setShowMonedaError(isEmptyInput(inputMoneda));
	};

  const handleInputChangeDate = (text) => {
    // Filtrar solo los dígitos
    const digits = text.replace(/\D/g, ""); 
    // Aplicar formato "DD/MM/AA" mientras el usuario escribe
    let formattedDate = "";
    for (let i = 0; i < digits.length; i++) {
      if (i === 2 || i === 4) {
        formattedDate += "/";
      }
      formattedDate += digits[i];
    }
    // Limitar la longitud a 10 caracteres
    if (formattedDate.length <= 10) {
      setInputFormattedDate(formattedDate);
    }
    if (digits.length <= 8) {
      const day = parseInt(digits.substr(0, 2), 10);
      const month = parseInt(digits.substr(2, 2), 10) - 1;
      const year = parseInt(digits.substr(4, 4), 10);

      const date = new Date(year, month, day);
      setInputDate(date)

      setShowDateError(
        !(
          date.getDate() === day &&
          date.getMonth() === month &&
          date.getFullYear() === year &&
          year > 1900
        )
      );
    }
  };

  const handleChipPress = (category) => {
    SetInputCategory(category);
  };

  const handlePressSelectAll = () => {
    if (!selectAll) {
      const todosLosCorreos = participantesGrupo.map((item) => item.correo);
      setInputParticipantes(todosLosCorreos);
    } 
    else {
      setInputParticipantes([]);
    }
    setSelectAll(!selectAll);
  };

  const isEmptyInput = (inputValue) =>{
		return inputValue.trim() === "";
	}

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    if(contentHeight > screenHeight - 100) //Esto por diferencia entre tamanios de pantalla en IOS y android
      setScrollEnabled(true)
    else
      setScrollEnabled(false)
  };

  const openCurrencyActionSheet = () => {
    // Cierra el teclado antes de mostrar el ActionSheet
    Keyboard.dismiss();
  
    // Define las opciones de moneda que quieres mostrar en el ActionSheet
    const currencyOptions = ['Seleccionar moneda', 'UYU', 'USD', 'Cancelar'];
  
    // Muestra el ActionSheet con inputType en "none"
    showActionSheetWithOptions(
      {
        options: currencyOptions,
        cancelButtonIndex: currencyOptions.length - 1,
        inputType: 'none', // Establece inputType en "none" para evitar que aparezca el teclado
      },
      (selectedIndex) => {
        // Maneja la selección de moneda aquí
        if (selectedIndex === 1) {
          setInputMoneda("UYU");
        } 
        else if (selectedIndex === 2) {
          setInputMoneda("USD");
        }
      }
    );
  };
	return (
		<View style={{flex:1}}>
			<TopBar
				appBarTitle={"Registrar gasto"} 
				mode={"center-aligned"}
				showBackAction={true}
				actionIcon={'check'}
				actionIconColor={theme.colors.primary}
        action={handlePressConfirm}
			/>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true} 
            size={'large'}
          />
        </View>
      ) : 
      (
        <KeyboardAwareScrollView
          style={{ maxHeight: screenHeight - 100 }}
          onContentSizeChange={onContentSizeChange}
          scrollEnabled={scrollEnabled}
          resetScrollToCoords={{ x: 0, y: 0 }}
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          keyboardOpeningTime={0}
          extraScrollHeight={-200}
        >
          <View style={styles.container}>
            <Text 
              style={[styles.heading, {color:theme.colors.onBackground}]}
              variant="titleSmall"
            >
              Detalles
            </Text>

            <TextInput
              style={styles.button}
              onChangeText={handleInputChangeDescription}
              value={inputDescription}
              mode="outlined"
              label="Descripcion"
              placeholder="Descripcion"
              keyboardAppearance={keyboardApparience}
              error={showDescriptionError}
            />
            {showDescriptionError && (
              <HelperText type="error" style={styles.helperText}>
                Debe ingresar una descripcion
              </HelperText>
            )}
            
            <TextInput
                style={styles.button}
                onChangeText={handleInputChangeMonto}
                value={inputMonto}
                mode="outlined"
                label="Monto"
                placeholder="Monto"
                keyboardAppearance={keyboardApparience}
                keyboardType="numeric"
                error={showMontoError}
              />
              {showMontoError && (
                <HelperText type="error" style={styles.helperText}>
                  Debe ingresar un monto
                </HelperText>
              )}
                      
            <TextInput
              style={styles.button}
              onChangeText={handleInputChangeDate}
              value={inputFormattedDate}
              mode="outlined"
              label="Fecha"
              error={showDateError}
              placeholder="DD/MM/AAAA"
              keyboardAppearance={keyboardApparience}
              keyboardType="numeric"
            />
            {showDateError && (
              <HelperText type="error" style={styles.helperText}>
                Ingrese una fecha valida (DD/MM/AAAA)
              </HelperText>
            )}

            <TextInput
              style={styles.button}
              onChangeText={handleInputChangeMoneda}
              value={inputMoneda}
              mode="outlined"
              label="Moneda"
              error={showMonedaError}
              placeholder="UYU/USD"
              keyboardAppearance={keyboardApparience}
              onTouchStart={openCurrencyActionSheet}
            />
            {showMonedaError && (
              <HelperText type="error" style={styles.helperText}>
                Debe ingresar una moneda, UYU/USD
              </HelperText>
            )}
            
            <Text 
              style={[styles.heading, {color:theme.colors.onBackground}]}
              variant="titleSmall"
            >
              Categorias
            </Text>
            <View style={styles.containerChips}>
              {categorias.map((category) => (
                <Chip
                  style={styles.chip}          
                  mode="flat"
                  showSelectedOverlay
                  icon={categoryIconMap[category.nombre]}
                  key={category.id}
                  selected={inputCategory === category.id}
                  onPress={() => handleChipPress(category.id)}
                >
                  {category.nombre}
                </Chip>
              ))}
            </View>
            <View style={styles.containerCompartir}>
              <Text 
                style={[styles.heading, {color:theme.colors.onBackground}]}
                variant="titleSmall"
              >
                Compartir con 
              </Text>
              <Button
                mode='text'
                icon={() => <Icon name="chevron-down" size={18} color={theme.colors.onSecondaryContainer}/>}
                labelStyle={{color:theme.colors.onSecondaryContainer}}
                contentStyle={styles.contentStyle}
                onPress={handlePressSelectAll}
              >
                Todos
              </Button>
            </View>
            {participantesGrupo.map((item, index) => (
              <View key={item.correo}>
                <ListIntegrantes
                  participante={item.correo}
                  avatarSource={images[item.symbol]}
                  content={`${item.nombre} ${item.apellido}`}
                  selectAll={selectAll}
                  handleInputChangeParticipantes={handleInputChangeParticipantes}
                />
                {index < integrantesData.length - 1 && <Divider key={item.id}/>}
              </View>
            ))}
          </View>
        </KeyboardAwareScrollView>
      )}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
    flex:1,
		marginHorizontal:15,
	},
  containerChips:{
    flexDirection:"row",
    flexWrap:"wrap",
  },
  containerCompartir:{
    marginTop:10,
    flexDirection:"row",
    justifyContent:"space-between",
  },
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip:{
    marginRight:10,
    marginTop:10
  },
	avatar:{
		width:130,	
		height:130,
	},
	heading:{
    marginTop:10
	},
	button:{
		justifyContent:"center",
		marginVertical:8,
	},
  contentStyle:{
    flexDirection:"row-reverse",
    marginLeft:-3,
  },
  helperText: {
		marginTop:-10,
		marginBottom:-5,
  },
});


export default withTheme(RegistrarGasto);