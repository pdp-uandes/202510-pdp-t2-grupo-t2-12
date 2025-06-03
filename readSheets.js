function darAsignaturasPorCarrera() {
  const monton = SpreadsheetApp.getActiveSpreadsheet();
  const hojas = monton.getSheets();
  const datos = {};

  hojas.forEach(hoja => {
    const nombre = hoja.getName();
    if (!nombre.startsWith("c-")) return;

    const carrera = nombre.slice(2);
    const valores = hoja.getDataRange().getValues();
    const encabezado = valores[0];
    const filas = valores.slice(1);

    const indexTitulo = encabezado.indexOf("TITULO");
    const indexSemestre = encabezado.indexOf("Semestre");

    filas.forEach(fila => {
      const titulo = fila[indexTitulo];
      const semestre = fila[indexSemestre];

      if (!datos[titulo]) datos[titulo] = {};
      datos[titulo][carrera] = semestre;
    });
  });

  return datos;
}


function obtenerMenciones(filas, indexSemestre) {
  const menciones = new Set();
  filas.forEach(fila => {
    const semestre = fila[indexSemestre]?.toString() || "";
    const letra = semestre.match(/[A-Za-z]$/);
    if (letra) menciones.add(letra[0]);
  });
  return Array.from(menciones).sort();
}

function matrizSemestreCursos(datosParametro = null) {
  let datos;
  
  if (datosParametro && Array.isArray(datosParametro)) {
    datos = datosParametro;
  } else {
    const hoja = SpreadsheetApp.getActiveSheet();
    datos = hoja.getDataRange().getValues();
  }
 
  if (datos.length <= 1) return [];
 
  const encabezado = datos[0];
  const filas = datos.slice(1);
 
  const indexTitulo = encabezado.indexOf("TITULO");
  const indexSemestre = encabezado.indexOf("Semestre");
 
  if (indexTitulo === -1 || indexSemestre === -1) return [];
 
  const dict = filas.reduce((acc, fila) => {
    const titulo = fila[indexTitulo];
    const semestre = fila[indexSemestre];
   
    if (titulo && semestre) {
      const semestreStr = semestre.toString();
      return {
        ...acc,
        [semestreStr]: [...(acc[semestreStr] || []), titulo]
      };
    }
   
    return acc;
  }, {});
  
  return Object.entries(dict).map(([semestre, cursos]) => [semestre, ...cursos]);
}