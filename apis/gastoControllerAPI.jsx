import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function altaGasto(monto, moneda, descripcion, fecha, idGrupo, idCubiertoPor, idBeneficiados, idCategoria, userToken) {
  const url = `${API_BASE_URL}/api/gastos/`;

  const body = {
    "monto": monto,
    "moneda": moneda,
    "descripcion": descripcion,
    "fecha": fecha,
    "idGrupo": idGrupo,
    "idCubiertoPor": idCubiertoPor,
    "idBeneficiados": idBeneficiados,
    "idCategoria": idCategoria
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