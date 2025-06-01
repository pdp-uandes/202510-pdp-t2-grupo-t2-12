function vacioaCero(valor) {
  const numero = parseFloat(valor);

  if (isNaN(numero)) {
    return 0;
  }

  return numero;
}

function suma(array) {
  return array.reduce(function(acumulador, valor) {
    return acumulador + valor;
  }, 0);
}

function proporcionSCT(horasPresenciales, numSCT) {
  return horasPresenciales/(numSCT*(30/18))
}


function darProporcion(fila, encabezado) {
  const index = nombre => encabezado.indexOf(nombre);
  const indexClases = index("Clases");
  const indexAyud = index("Ayudantías");
  const indexLab = index("Laboratorios o Talleres");
  const indexTraba = index("Trabajos");
  const indexPres = index("Presentaciones");
  const indexLect = index("Lecturas");
  const indexEstud = index("Estudio");
  const indexSCT = index("SCT-Chile");

  const hClases = vacioaCero(fila[indexClases]);
  const hAyud = vacioaCero(fila[indexAyud]);
  const hLab = vacioaCero(fila[indexLab]);
  const hTraba = vacioaCero(fila[indexTraba]);
  const hPres = vacioaCero(fila[indexPres]);
  const hLect = vacioaCero(fila[indexLect]);
  const hEstud = vacioaCero(fila[indexEstud]);
  const hSCT = vacioaCero(fila[indexSCT]);

  const hPresencial = hClases + hAyud + hLab;
  const hTotal = hClases + hAyud + hLab + hTraba + hPres + hLect + hEstud;

  return (
    hPresencial / (hSCT * (30 / 18)));
}

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

function contarRequisitos(fila, indexRequisitos) {
  const campo = fila[indexRequisitos];
  if (!campo) return 0;

  return campo
    .toString()
    .split(",")
    .map(x => x.trim())
    .filter(x => x !== "")
    .length;
}



function horasPresenciales(fila, encabezado) {
  const index = nombre => encabezado.indexOf(nombre);
  return (
    vacioaCero(fila[index("Clases")]) +
    vacioaCero(fila[index("Ayudantías")]) +
    vacioaCero(fila[index("Laboratorios o Talleres")])
  );
}

function horasTotales(fila, encabezado) {
  const index = nombre => encabezado.indexOf(nombre);

  const hClases = vacioaCero(fila[index("Clases")]);
  const hAyud  = vacioaCero(fila[index("Ayudantías")]);
  const hLab   = vacioaCero(fila[index("Laboratorios o Talleres")]);
  const hTrab  = vacioaCero(fila[index("Trabajos")]);
  const hPres  = vacioaCero(fila[index("Presentaciones")]);
  const hLect  = vacioaCero(fila[index("Lecturas")]);
  const hEst   = vacioaCero(fila[index("Estudio")]);

  return hClases + hAyud + hLab + hTrab + hPres + hLect + hEst;
}

function calcularAsignaturaNucleo(datos, indexCodigo, indexTitulo, indexRequisitos) {
  // 1) Construir mapa título → código, para encontrar código a partir del título
  const tituloAcodigo = datos.reduce((acc, fila) => {
    const codigo = fila[indexCodigo];
    const titulo = fila[indexTitulo];
    acc[titulo] = codigo;
    return acc;
  }, {});

  // 2) Con el mismo datos + índices, construir mapa código → [títulosDependientesDirectos]
  const dependientesDirectos = obtenerDependientes(datos, indexCodigo, indexTitulo, indexRequisitos);
  

  let maxScore = -Infinity;
  let asignaturasNucleo = [];

  // 3) Recorrer cada fila para calcular su “score núcleo”
  datos.forEach(fila => {
    const codigo = fila[indexCodigo];
    const titulo = fila[indexTitulo];

    // 3.1) Número de requisitos (mínima cantidad de cursos previos)
    const nReq = contarRequisitos(fila, indexRequisitos);

    // 3.2) Número de dependientes directos (si no existe, 0)
    const listaDeps = dependientesDirectos[codigo] || [];
    const nDepsDirectos = listaDeps.length;

    // 3.3) Número de dependientes de segundo nivel:
    let nDepsSegundoNivel = 0;
    listaDeps.forEach(tituloDepDirecto => {
      const codigoDep = tituloAcodigo[tituloDepDirecto];
      if (!codigoDep) return; // por si acaso no coincide
      const depsDeDep = dependientesDirectos[codigoDep] || [];
      nDepsSegundoNivel += depsDeDep.length;
    });

    // 3.4) Calcular “score”
    const score = nReq + 2 * nDepsDirectos + nDepsSegundoNivel;

    // 3.5) Comparar con el máximo actual
    if (score > maxScore) {
      maxScore = score;
      asignaturasNucleo = [titulo];
    } else if (score === maxScore) {
      asignaturasNucleo.push(titulo);
    }
  });

  return asignaturasNucleo.join(" / ");
}