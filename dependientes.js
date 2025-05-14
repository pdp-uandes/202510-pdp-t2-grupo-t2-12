function obtenerDependientes(datos, indexCodigo, indexTitulo, indexRequisitos) {
  return datos.reduce((acc, fila) => {
    const requisitos = fila[indexRequisitos];
    if (!requisitos) return acc;

    requisitos
      .split(",")
      .map(req => req.trim().replace(/\(p\)/, "")) // limpiamos (p) y espacios
      .forEach(cod => {
        acc[cod] = [...(acc[cod] || []), fila[indexTitulo]]; // nueva lista sin mutar anterior
      });

    return acc;
  }, {});
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
