import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function iniciarSesion(correo, password, expoPushToken) {
  const url = `${API_BASE_URL}/api/auth/login`;

  const body = {
    "correo": correo,
    "password": password,
    "expoPushToken": expoPushToken,
  }

  try {
    const response = await axios.post(url, body);
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}

export async function logout(correo, userToken) {
  const url = `${API_BASE_URL}/api/auth/logout`;

  const body = {
    "correo": correo,
  }

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.post(url, body, {headers});
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}

export async function registroUsuario(correo, nombre, apellido, password) {
  const url = `${API_BASE_URL}/api/auth/registro`;

  const body = {
    "correo": correo,
    "nombre": nombre,
    "apellido": apellido,
    "password": password,
  }

  try {
    const response = await axios.post(url, body);
    return  response.data
  } 
  catch (error) {
    throw error;
  }
}

export async function enviarMail(idUsuario) {
  const url = `${API_BASE_URL}/api/auth/contrasena`;

  const body = {
    "idUsuario": idUsuario,
  }

  try {
    const response = await axios.post(url, body);
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}