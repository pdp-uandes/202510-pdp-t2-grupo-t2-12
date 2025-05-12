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
