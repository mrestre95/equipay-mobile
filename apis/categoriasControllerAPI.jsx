import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function obtenerCategorias(userToken) {
  const url = `${API_BASE_URL}/api/categorias/`;

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