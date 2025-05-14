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

function agregarDependientes() {
  const hoja = SpreadsheetApp.getActiveSheet();
  const datos = hoja.getDataRange().getValues();
  if (datos.length <= 1) return;

  const encabezado = datos[0];
  const filas = datos.slice(1);

  const indexCodigo = encabezado.indexOf("CODIGO");
  const indexTitulo = encabezado.indexOf("TITULO");
  const indexRequisitos = encabezado.indexOf("Requisitos");

  // Obtener objeto de dependencias
  const dependientes = obtenerDependientes(filas, indexCodigo, indexTitulo, indexRequisitos);

  // Agregar encabezado de la nueva columna
  const indexDependientes = encabezado.length;
  hoja.getRange(1, indexDependientes + 1).setValue("Dependientes");

  // Escribir dependientes en cada fila
  filas.forEach((fila, i) => {
    const codigo = fila[indexCodigo];
    const deps = dependientes[codigo] || [];
    hoja.getRange(i + 2, indexDependientes + 1).setValue(deps.join(", "));
  });

  SpreadsheetApp.getUi().alert("Dependientes agregados correctamente.");
}

function generarHojaAsignaturas(asignaturasPorCarrera) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();

  const hojaAnterior = libro.getSheetByName("Asignaturas");
  if (hojaAnterior) libro.deleteSheet(hojaAnterior);
  
  const hoja = libro.insertSheet("Asignaturas");

  const titulos = Object.keys(asignaturasPorCarrera).sort();

  
  const carreras = titulos
    .flatMap(titulo => Object.keys(asignaturasPorCarrera[titulo]))
    .filter((carrera, index, self) => self.indexOf(carrera) === index)
    .sort();

  hoja.getRange(1, 1).setValue("TITULO");
  carreras.forEach((carrera, i) => {
    hoja.getRange(1, i + 2).setValue(carrera);
  });

  titulos.forEach((titulo, fila) => {
    hoja.getRange(fila + 2, 1).setValue(titulo);
    carreras.forEach((carrera, col) => {
      const semestre = asignaturasPorCarrera[titulo][carrera];
      if (semestre !== undefined) {
        hoja.getRange(fila + 2, col + 2).setValue(semestre);
      }
    });
  });
}

function pintarHojaAsignaturas() {
  const hoja = SpreadsheetApp.getActiveSheet();
  const datos = hoja.getDataRange().getValues();

  if (datos.length <= 1) return;

  const encabezado = datos[0];
  const filas = datos.slice(1);

  const cantidadCarreras = encabezado.length - 1;

  filas.forEach((fila, i) => {
    const presentes = fila.slice(1).filter(x => x !== "").length;
    let color = "#ffffff";
  


    if (presentes === cantidadCarreras) {
      color = "#66ff66";
    } 
    else if (presentes > 1) {
      color = "#ffff44";
    }
    else if (presentes === 1) {
      color = "#AAAAAA";
    } 

    hoja.getRange(i + 2, 1, 1, encabezado.length).setBackground(color);

  });

}


function asignaturasPorCarrera() {
  datos = darAsignaturasPorCarrera();
  generarHojaAsignaturas(datos);
  pintarHojaAsignaturas();
  SpreadsheetApp.getUi().alert("Asignaturas por carrera generadas correctamente.");
}