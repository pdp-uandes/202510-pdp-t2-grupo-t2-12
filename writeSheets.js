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

function generarAnalisis() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hojas = libro.getSheets();

  // Estructura para almacenar resultados:
  const resultados = {
    "Asignatura con más requisitos": {},
    "Cantidad sin requisitos": {},
    "Asignatura con más horas presenciales": {},
    "Semestre con más horas presenciales": {},
    "Semestre con menos horas presenciales": {},
    "Proporción promedio horas presenciales vs. horas totales": {},
    "Asignatura núcleo": {}
  };

  // Recorrer cada hoja de carrera (prefijo "c-")
  hojas.forEach(hoja => {
    const nombreHoja = hoja.getName();
    if (!nombreHoja.startsWith("c-")) return;

    const carrera = nombreHoja.slice(2);
    const valores  = hoja.getDataRange().getValues();
    if (valores.length <= 1) {
      
      for (let metrica in resultados) {
        resultados[metrica][carrera] = "";
      }
      return;
    }

    const encabezado = valores[0];
    const filas      = valores.slice(1);

    // Indices de columnas clave:
    const indexCodigo       = encabezado.indexOf("CODIGO");
    const indexTitulo       = encabezado.indexOf("TITULO");
    const indexRequisitos   = encabezado.indexOf("Requisitos");
    const indexSemestre     = encabezado.indexOf("Semestre");
    // Para horas presenciales:
    const indexClases       = encabezado.indexOf("Clases");
    const indexAyud         = encabezado.indexOf("Ayudantías");
    const indexLab          = encabezado.indexOf("Laboratorios o Talleres");
    // Para horas totales:
    const indexTrabajos     = encabezado.indexOf("Trabajos");
    const indexPres         = encabezado.indexOf("Presentaciones");
    const indexLect         = encabezado.indexOf("Lecturas");
    const indexEstudio      = encabezado.indexOf("Estudio");

    // Variables por carrera:
    let maxReq            = -1;
    let asignaturaMaxReq  = [];
    let sinRequisitos     = 0;
    let maxHorasPres      = -1;
    let asignaturaMaxHoras= [];

    // Mapa semestre = suma de horas presenciales en ese semestre
    const mapaHorasPorSemestre = {};
    // Para calculo de proporciones promedio
    let sumaProporciones = 0;
    let conteoCursos     = 0;

    // Recorrer cada asignatura (fila a fila)
    filas.forEach(fila => {
      const titulo = fila[indexTitulo];
      const codigo = fila[indexCodigo];

      // Requisitos
      const nReq = contarRequisitos(fila, indexRequisitos);
      if (nReq > maxReq) {
        maxReq = nReq;
        asignaturaMaxReq = [titulo];
      } else if (nReq === maxReq) {
        asignaturaMaxReq.push(titulo);
      }
      if (!fila[indexRequisitos] || fila[indexRequisitos].toString().trim() === "") {
        sinRequisitos++;
      }

      // Horas presenciales
      const hPres = horasPresenciales(fila, encabezado);
      if (hPres > maxHorasPres) {
        maxHorasPres = hPres;
        asignaturaMaxHoras = [titulo];
      } else if (hPres === maxHorasPres) {
        asignaturaMaxHoras.push(titulo);
      }

      
      const sem = fila[indexSemestre];
      if (sem !== "" && sem != null) {
        mapaHorasPorSemestre[sem] = (mapaHorasPorSemestre[sem] || 0) + hPres;
      }

      // Proporción hPres/hTot
      const hTot = horasTotales(fila, encabezado);
      if (hTot > 0) {
        sumaProporciones += (hPres / hTot);
        conteoCursos++;
      }
    });

    // Calcular semestre con más/menos horas presenciales
    let semMaxHoras = "";
    let semMinHoras = "";
    let valorMaxSem = -Infinity;
    let valorMinSem = Infinity;
    for (const sem in mapaHorasPorSemestre) {
      const sumaSem = mapaHorasPorSemestre[sem];
      if (sumaSem > valorMaxSem) {
        valorMaxSem = sumaSem;
        semMaxHoras = sem;
      }
      if (sumaSem < valorMinSem) {
        valorMinSem = sumaSem;
        semMinHoras = sem;
      }
    }
    
    if (valorMaxSem === -Infinity) semMaxHoras = "";
    if (valorMinSem === Infinity)  semMinHoras = "";

    // Proporción promedio
    const promedioProporcion = (conteoCursos > 0)
      ? (sumaProporciones / conteoCursos)
      : 0;

    // Asignatura núcleo
    const asignaturaNucleo = calcularAsignaturaNucleo(
      filas,
      indexCodigo,
      indexTitulo,
      indexRequisitos
    );

    // Guardar resultados en el objeto “resultados”
    resultados["Asignatura con más requisitos"][carrera]            = asignaturaMaxReq.join(" / ");
    resultados["Cantidad sin requisitos"][carrera]                  = sinRequisitos;
    resultados["Asignatura con más horas presenciales"][carrera]    = asignaturaMaxHoras.join(" / ");
    resultados["Semestre con más horas presenciales"][carrera]      = semMaxHoras;
    resultados["Semestre con menos horas presenciales"][carrera]    = semMinHoras;
    
    resultados["Proporción promedio horas presenciales vs. horas totales"][carrera]         = promedioProporcion.toFixed(2)*100 + "%";
    resultados["Asignatura núcleo"][carrera]                         = asignaturaNucleo;
  });

  //  Crear o reemplazar hoja Análisis
  const hojaAnterior = libro.getSheetByName("Análisis");
  if (hojaAnterior) libro.deleteSheet(hojaAnterior);
  const hojaAnalisis = libro.insertSheet("Análisis");

  
  const carreras = Object.keys(resultados["Asignatura con más requisitos"]);

  
  hojaAnalisis.getRange(1, 1).setValue("Métrica");
  carreras.forEach((carrera, j) => {
    hojaAnalisis.getRange(1, j + 2).setValue(carrera);
  });


  const nombresMetricas = Object.keys(resultados);
  nombresMetricas.forEach((metrica, i) => {
    hojaAnalisis.getRange(i + 2, 1).setValue(metrica);
    carreras.forEach((carrera, j) => {
      const valor = resultados[metrica][carrera];
      hojaAnalisis.getRange(i + 2, j + 2).setValue(valor);
    });
  });


  const rango = hojaAnalisis.getDataRange();
  rango.setWrap(true);
  rango.setHorizontalAlignment("center");
  rango.setVerticalAlignment("middle");

  const ultCol = hojaAnalisis.getLastColumn();
  for (let col = 1; col <= ultCol; col++) {
    hojaAnalisis.autoResizeColumn(col);
  }

  const ultFila = hojaAnalisis.getLastRow();
  for (let fila = 1; fila <= ultFila; fila++) {
    hojaAnalisis.setRowHeight(fila, 40);
  }

  rango.setBorder(true, true, true, true, true, true);

  SpreadsheetApp.getUi().alert("Análisis generado correctamente.");
}