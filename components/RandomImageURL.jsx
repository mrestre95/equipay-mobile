export function getRandomImage(images) {

  // Genera un índice aleatorio dentro del rango de claves del objeto images
  const keys = Object.keys(images);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return randomKey
}

export function asignarIndiceSegunPrimeraLetra(nombre) {
  const primeraLetra = nombre.charAt(0).toUpperCase(); // Obtenemos la primera letra en mayúscula

  // Definimos los rangos para las letras del alfabeto
  const rangos = [
    'A-C', 'D-F', 'G-I', 'J-L', 'M-O', 'P-R', 'S-U', 'V-X', 'Y-Z', '0-9', 'Otros'
  ];

  // Creamos un objeto que asocia cada letra a un rango
  const asignaciones = {
    'A': 1, 'B': 1, 'C': 1,
    'D': 2, 'E': 2, 'F': 2,
    'G': 3, 'H': 3, 'I': 3,
    'J': 4, 'K': 4, 'L': 4,
    'M': 5, 'N': 5, 'O': 5,
    'P': 6, 'Q': 6, 'R': 6,
    'S': 7, 'T': 7, 
    'U': 7, 'V': 8, 
    'W': 8, 'X': 9,
    'Y': 9, 'Z': 10,
    '0': 11, '1': 11, '2': 11, '3': 11, '4': 11, '5': 11, '6': 11, '7': 11, '8': 11, '9': 11,
  };

  // Comprobamos si la letra está en las asignaciones, de lo contrario, la consideramos "Otros"
  const rango = asignaciones[primeraLetra] || 'Otros';

  // Devolvemos el índice + 1 para obtener el número del 1 al 11
  return rango;
}