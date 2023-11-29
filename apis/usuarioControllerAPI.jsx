import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function getGruposUsuario(userId, userToken) {
  const url = `${API_BASE_URL}/api/usuarios/${userId}/grupos`;

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.get(url, {headers});
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}

export async function getNotificacionesUsuario(userId, userToken) {
  const url = `${API_BASE_URL}/api/usuarios/${userId}/notificaciones`;

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.get(url, {headers});
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}

export async function altaUsuario(correo, nombre, apellido, password) {
  const url = `${API_BASE_URL}/api/usuarios/`;

  const body = {
    "correo": correo,
    "nombre": nombre,
    "apellido": apellido,
    "password": password,
  }

  try {
    const response = await axios.post(url, body);
    return response.data
  } 
  catch (error) {
    throw error;
  }
}

export async function modificarUsuario(idUsuario, nombre, apellido, password, userToken) {
  const url = `${API_BASE_URL}/api/usuarios/${idUsuario}`;

  const body = {
    "nombre": nombre,
    "apellido": apellido,
    "password": password,
  }

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.put(url, body, { headers: headers });
    return [response.data, response.status]
  } 
  catch (error) {
    throw error;
  }
}

export async function eliminarUsuario(idUsuario, userToken) {
  const url = `${API_BASE_URL}/api/usuarios/${idUsuario}`;

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.delete(url, {headers});
    return response.data
  } 
  catch (error) {
    throw error;
  }
}

export async function getUsuario(idUsuario, userToken) {
  const url = `${API_BASE_URL}/api/usuarios/${idUsuario}`;

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.get(url, {headers});
    return response.data
  } 
  catch (error) {
    throw error;
  }
}