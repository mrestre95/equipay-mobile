import React, { createContext, useContext, useState } from 'react';
import { decode } from 'base-64';

// Crea un contexto para el tema
const UserContext = createContext();

// Crea un proveedor de contexto para el tema
export const UserProvider = ({ children }) => {
  const [isDarkThemeUser, setIsDarkThemeUser] = useState(false);
  const [keyboardApparience, setKeyboardApparience] = useState('default');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [loggedUser, setLoggedUser] = useState("");
  const [userToken, setUserToken] = useState("");
  const [userName, setUserName] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);



  // Función para cambiar entre tema claro y oscuro
  const toggleTheme = () => {
    setIsDarkThemeUser((prevTheme) => !prevTheme);
    isDarkThemeUser === 'light' ? setKeyboardApparience("light") : setKeyboardApparience("dark")
  };

  const processUserToken = (token) => {
    try {
      setUserToken(token);
      const partes = token.split('.');
      const parteCodificada = partes[1];
      const parteDecodificada = decode(parteCodificada);
  
      const datos = JSON.parse(parteDecodificada);
  
      setLoggedUser(datos.sub)
      setUserName(datos.nombre)
    } 
    catch (error) {
      console.error("Error in processUserToken:", error);
    }
  }

  const notificationsCounter = () => {
    setNotificationsCount((prevCount) => {
      const newCount = prevCount + 1;
      return newCount;
    });
  }

  const resetNotificationsCounter = () => {
    setNotificationsCount(0)
  }

  return (
    <UserContext.Provider value={{ isDarkThemeUser, toggleTheme, keyboardApparience, expoPushToken, loggedUser, userToken, setKeyboardApparience, setExpoPushToken, setLoggedUser, setUserToken, processUserToken, userName, notificationsCounter, resetNotificationsCounter, notificationsCount }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para acceder al contexto del tema
export const useUserContext = () => {
  return useContext(UserContext);
};
