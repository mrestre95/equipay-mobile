import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function crearGrupoUsuario(userId, groupName, groupDescription, userToken) {
  const url = `${API_BASE_URL}/api/grupos/`;

  const body = {
    "nombre": groupName,
    "descripcion": groupDescription,
    "idDueño": userId
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

export async function eliminarGrupo(groupId, userToken) {
  const url = `${API_BASE_URL}/api/grupos/${groupId}`;

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.delete(url, {headers});
    return response.data;
  } 
  catch (error) {
    throw error;
  }
}

export async function obtenerGastosGrupo(groupId, userToken) {
  const url = `${API_BASE_URL}/api/grupos/${groupId}/gastos`;

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

export async function obtenerPagosGrupo(groupId, userToken) {
  const url = `${API_BASE_URL}/api/grupos/${groupId}/pagos`;

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

export async function obtenerGrupo(groupId, userToken) {
  const url = `${API_BASE_URL}/api/grupos/${groupId}/usuarios`;

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

export async function unirseGrupo(idUsuario, codGrupo, userToken,) {
  const url = `${API_BASE_URL}/api/grupos/usuarios-codigo`;

  const body = {
    "idUsuario": idUsuario,
    "codGrupo": codGrupo,
  }

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.post(url, body, {headers});
    return response.data
  } 
  catch (error) {
    throw error;
  }
}

export async function invitarAmigos(idGrupo, idUsuariosInput, userToken) {
  const url = `${API_BASE_URL}/api/grupos/invitar-amigos`;
  
  // Transformar la cadena de idUsuarios
  const idUsuariosArray = idUsuariosInput.split(',').map(idUsuario => idUsuario.trim());
  const body = {
    "idGrupo": idGrupo,
    "idUsuarios": idUsuariosArray
  };

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.post(url, body, {headers});
    return response.data;
  } catch (error) {
    throw error;
  }
}

