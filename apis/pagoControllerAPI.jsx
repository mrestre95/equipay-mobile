import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function agregarPago(monto, moneda, fecha, idGrupo, idRealiza, idRecibe, userToken) {
  const url = `${API_BASE_URL}/api/pagos/`;

  const body = {
      "monto": monto,
      "moneda": moneda,
      "fecha": fecha,
      "idGrupo": idGrupo,
      "idRealiza": idRealiza,
      "idRecibe": idRecibe
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