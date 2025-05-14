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