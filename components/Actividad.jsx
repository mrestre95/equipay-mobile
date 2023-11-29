import React, {useState, useEffect} from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Divider, ActivityIndicator } from 'react-native-paper';
import TopBar from './TopBar';

import ListItem from './ListItem';
import { getNotificacionesUsuario } from '../apis/usuarioControllerAPI';
import { useUserContext } from '../contexts/UserContext';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import EmptyList from './EmptyList';


const Actividad = () => {

  const { loggedUser, userToken, resetNotificationsCounter } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  const isFocused = useIsFocused();
	const navigation = useNavigation();


	const getUserNotifications = async () => {
    try {
      setIsLoading(true)
      const notificaciones = await getNotificacionesUsuario(loggedUser, userToken);
      setNotificaciones(notificaciones);
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
      getUserNotifications();
      resetNotificationsCounter();
    }
  }, [isFocused]);


  // Configura la función de renderizado para cada elemento de la lista
  const renderItem = ({ item, index }) => (
    <View key={item.id}>
      <ListItem
        remitente={item.envia}
        isNotification
        content={item.message}
        date={item.fecha}
      />
      {<Divider />}
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        appBarTitle={"Actividad"}
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
        notificaciones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyList
              heading={'Oops!'}
              message={"Aun no tienes actividad, crea un grupo para comenzar"}
              image={'notification'}
              addButton
              buttonName={'Crear grupo'}
              icon={'plus'}
              action={() => navigation.navigate("CrearGrupo")}
            />
          </View>
        ) : (
          <FlatList
            data={notificaciones}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  emptyContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});

export default Actividad;
