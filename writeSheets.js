  function colorearCurso() {
    const hoja = SpreadsheetApp.getActiveSheet();
    const datos = hoja.getDataRange().getValues();

    if (datos.length <= 1) return;

    const encabezado = datos[0];
    const filas = datos.slice(1);

    // Función para obtener índice de una columna
    function index(nombre) {
      return encabezado.indexOf(nombre);
    }

    // Luego: calcular proporción y colorear según reglas
    filas.forEach((fila, i) => {
      const proporcion = darProporcion(fila, encabezado);
      Logger.log(`Fila ${i + 1}: ${proporcion}`); // Log para depuración
      let color = "#ffffff"; // por defecto blanco

      if (proporcion >= 0.6) {
        color = "#ff0000"; // rojo
      } else if (proporcion >= 0.4) {
        color = "#ffff00"; // amarillo
      } else if (proporcion < 0.4) {
        color = "#00ff00"; // verde
      }

      hoja.getRange(i + 2, 1, 1, encabezado.length).setBackground(color);
    });

    SpreadsheetApp.getUi().alert("Cursos coloreados correctamente.");
  }


  function resetearColores() {
    const hoja = SpreadsheetApp.getActiveSheet();
    const datos = hoja.getDataRange().getValues();
    const encabezado = datos[0];
    const filas = datos.slice(1);

    filas.forEach((_, i) => {
      hoja.getRange(i + 2, 1, 1, encabezado.length).setBackground("#ffffff");
    });
  }
