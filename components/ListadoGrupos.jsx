import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Divider, withTheme, Searchbar, Text, Button, ActivityIndicator, Menu } from 'react-native-paper';
import TopBar from './TopBar';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SwipeableList from './SwipeableList'
import { getGruposUsuario } from '../apis/usuarioControllerAPI';
import { eliminarGrupo } from '../apis/grupoControllerAPI';
import { useUserContext } from '../contexts/UserContext';
import EmptyList from './EmptyList';

const ListadoGrupos = ({ theme }) => {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;
  const isFocused = useIsFocused();
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGrupos, setFilteredGrupos] = useState(null);
  const [grupos, setGrupos] = useState(null);
  const [existenGrupos, setExistenGrupos] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const { loggedUser, userToken } = useUserContext();

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const grupos = await getGruposUsuario(loggedUser, userToken);
      setGrupos(grupos);
      setFilteredGrupos(grupos);
      if (!Object.keys(grupos).length) {
        setExistenGrupos(false);
      } 
      else {
        setExistenGrupos(true);
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

  const handleSwipe = async(groupId) => {
    try {
      const response = await eliminarGrupo(groupId, userToken);

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

  const handleItemPress = (groupId, groupName) => {
    const groupData = {
      id: groupId,
      nombre: groupName
    };
    navigation.navigate('DetallesGrupo', groupData);
  };
  
  useEffect(() => {
    if (isFocused) { // Verifica si el componente está enfocado
      fetchData(); // Si está enfocado, realiza la solicitud de datos
    }
  }, [isFocused]); // Escucha cambios en isFocused
  

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    // Filtrar los elementos en base a la consulta
    const filtered = grupos.filter((item) => {
      return item.nombre.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredGrupos(filtered);
    // Restablecer la lista cuando se borra la búsqueda
    if (query === '') {
      setFilteredGrupos(grupos);
    }
  };

  const onContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    if (contentHeight > screenHeight - 130) // Esto por diferencia entre tamaños de pantalla en IOS y Android
      setScrollEnabled(true)
    else
      setScrollEnabled(false)
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        appBarTitle={"Grupos"}
        mode={"center-aligned"}
        actionIcon={'account-multiple-plus'}
        isMenu
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            animating={true}
            size={'large'}
          />
        </View>
      ) :       
      existenGrupos ? (
        <View>
          <View style={styles.searchBarContainer}>
            <Searchbar
              placeholder='Buscar grupo'
              onChangeText={onChangeSearch}
              value={searchQuery}
              style={[styles.searchBar, {backgroundColor:theme.colors.searchBar}]}
              inputStyle={styles.inputStyle}
              theme={{ colors: { onSurface: theme.colors.searchBarText } }}
            />
          </View>
          <Divider horizontalInset />
          <SwipeableList
            data={filteredGrupos}
            handleSwipe={handleSwipe}
            handleItemPress={handleItemPress}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyList
            heading={'Oops !'}
            message={"Aun no existen grupos :("}
            image={'noData'}
            addButtons
            buttonName={'Crear grupo'}
            button2Name={'Unirse grupo'}
            icon={'plus'}
            action={() => navigation.navigate("CrearGrupo")}
            action2={() => navigation.navigate("UnirseGrupo")}
          />
        </View>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    alignItems: 'center',
    marginBottom:20,
  },
  emptyContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  searchBar: {
    width: '95%',
    height:35,
    borderRadius:10,
    backgroundColor:'red'
  },
  inputStyle:{
    marginVertical:-15,
    fontSize:15,
  },
  image:{
		width:400,
		height:400,
		marginBottom:-45

	},
	text:{
		marginBottom:10,
	},
	buttonConfirm:{
		width:160,
		height:45,
		margin:50,
	},
});

export default withTheme(ListadoGrupos);
