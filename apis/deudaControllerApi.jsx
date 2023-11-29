import axios from 'axios';
import { API_BASE_URL } from '@env'

export async function getDeudasUsuarioGrupo(idUsuario, idGrupo, userToken) {
  const url = `${API_BASE_URL}/api/deudas`;

  const queryParams = {
    idUsuario: idUsuario,
    idGrupo: idGrupo,
  };

  const headers = {
    'Authorization': `Bearer ${userToken}`,
  };

  try {
    const response = await axios.get(url, {
      headers: headers,
      params: queryParams,
    });
    const deudas = response.data.deudas;
    // Procesar la respuesta
    if(deudas.length > 0){
      const deudasProcesadas = {
        idUsuario: response.data.idUsuario,
        idGrupo: response.data.idGrupo,
        deudas: deudas.map((deuda) => ({
          moneda: deuda.moneda,
          deudaEnGrupo: deuda.deudaEnGrupo,
          sugerencias: deuda.sugerencias.map((sugerencia) => ({
            usuario: sugerencia.usuario,
            monto: sugerencia.monto,
            moneda: sugerencia.moneda
          })),
        })),
      };
      return deudasProcesadas
    }
    else{
      return null
    }
  } 
  catch (error) {
    throw error;
  }
}