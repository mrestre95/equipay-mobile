import React from 'react';
import IniciarSesion from './IniciarSesion';
import LoginForm from './LoginForm';
import NavigationBar from './NavigationBar';
import RecoveryPasswordForm from './RecoveryPasswordForm';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditarPerfil from './EditarPerfil';
import CrearGrupo from './CrearGrupo';
import RegistroUsuario from './RegistroUsuario';
import DetallesGrupo from './DetallesGrupo';
import RegistrarGasto from './RegistrarGasto';
import ConsultarDeuda from './ConsultarDeuda';
import RealizarPago from './RealizarPago';
import ListadoGrupos from './ListadoGrupos';
import ConfirmationScreen from './ConfirmationScreen';
import UnirseGrupo from './UnirseGrupo';
import InvitarAmigos from './InvitarAmigos';

const Stack = createNativeStackNavigator();


const NavigationStack = () => {
  return (
      <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // Puedes usar 'fade', 'slide_from_right', 'slide_from_left', 'slide_from_bottom', etc.
      }}
        initialRouteName="IniciarSesion">
        <Stack.Screen 
          name="IniciarSesion" 
          component={IniciarSesion}
        /> 
        <Stack.Screen 
          name="LoginForm" 
          component={LoginForm}
        />
        <Stack.Screen 
          name="NavigationBar" 
          component={NavigationBar}
        />
        <Stack.Screen 
          name="RecoveryPasswordForm" 
          component={RecoveryPasswordForm}
        />          
        <Stack.Screen 
          name="EditProfile" 
          component={EditarPerfil}
        />
        <Stack.Screen 
          name="CrearGrupo" 
          component={CrearGrupo}
        />
        <Stack.Screen 
          name="ListadoGrupos" 
          component={ListadoGrupos}
        />       
        <Stack.Screen 
          name="RegistroUsuario" 
          component={RegistroUsuario}
        />
        <Stack.Screen 
          name="DetallesGrupo" 
          component={DetallesGrupo}
        />
        <Stack.Screen 
          name="RegistrarGasto" 
          component={RegistrarGasto}
        />
        <Stack.Screen 
          name="ConsultarDeuda" 
          component={ConsultarDeuda}
        />  
        <Stack.Screen 
          name="RealizarPago" 
          component={RealizarPago}
        />
        <Stack.Screen 
          name="ConfirmationScreen" 
          component={ConfirmationScreen}
        />
        <Stack.Screen 
          name="UnirseGrupo" 
          component={UnirseGrupo}
        />
        <Stack.Screen 
          name="InvitarAmigos" 
          component={InvitarAmigos}
        />                                     
                       
      </Stack.Navigator>
  );
};

export default NavigationStack;
