import React, { useState, useEffect } from 'react';
import { StatusBar, Appearance } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NavigationStack from './components/NavigationStack';
import { NativeBaseProvider } from 'native-base';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import CustomDarkTheme from './assets/themes/CustomDarkTheme.json'
import CustomLightTheme from './assets/themes/CustomLightTheme.json'
import { useUserContext, UserProvider } from './contexts/UserContext'
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';


const themes = {
  roundness: 40,
  dark: {
    ...MD3DarkTheme,
    colors: CustomDarkTheme.colors,
    roundness:2.5
  },
  light: {
    ...MD3LightTheme,
    colors: CustomLightTheme.colors,
    roundness:2.5
  }
}

AppContent = () => {
  const { setKeyboardApparience, setExpoPushToken, notificationsCounter } = useUserContext();

    //----------------Configuracion de notificaciones----------------------
    useEffect(() => {
      registerForPushNotificationsAsync();
    }, []);
  
    const registerForPushNotificationsAsync = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
  
        if (status !== 'granted') {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== 'granted') {
            console.log('Permisos de notificación no otorgados');
            return;
          }
        }
  
        // Proporciona projectId si es necesario
        const expoPushToken = (await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })).data;
        console.log('Expo Push Token:', expoPushToken);
        setExpoPushToken(expoPushToken);
      } 
      catch (error) {
        console.error('Error al obtener el Expo Push Token:', error);
      }
    };

    useEffect(() => {
      // Suscribirse al evento de notificación
      const subscription = Notifications.addNotificationReceivedListener(handleNotification);
  
      // Limpiar la suscripción al desmontar el componente
      return () => subscription.remove();
    }, []);
  
    function handleNotification(notification) {
      // Manejar la notificación aquí
      console.log('Notificación recibida:', notification);
      notificationsCounter()
    }

    //-----------------------------------//---------------------------------



  const [theme, setTheme] = useState(Appearance.getColorScheme())

  Appearance.addChangeListener((scheme) =>{
    setTheme(scheme.colorScheme)
    setKeyboardApparience(scheme.colorScheme)
  })
  
  const isDarkTheme = theme === 'dark' ? true : false;

  isDarkTheme ? StatusBar.setBarStyle('light-content') : StatusBar.setBarStyle('dark-content');

  return (
      <PaperProvider theme={isDarkTheme ? themes.dark : themes.light}>
        <SafeAreaProvider>
          <NativeBaseProvider>
            <NavigationContainer theme={isDarkTheme ? themes.dark : themes.light}>
              <NavigationStack />
            </NavigationContainer>
          </NativeBaseProvider>
        </SafeAreaProvider>
      </PaperProvider>
  );
}

//Lo hice de esta manera ya que para poder acceder al valor del context el componente que utiliza el valor debe estar dentro del UserProvider
App = () => {
  return (
    <ActionSheetProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ActionSheetProvider>
  );
}

export default App 

