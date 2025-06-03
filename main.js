function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Menu Tarea 2')
    .addItem('Colorear curso', 'colorearCurso')
    .addSeparator()
    .addItem('Dependientes', 'agregarDependientes')
    .addSeparator()
    .addItem('Asignaturas por carrera', 'asignaturasPorCarrera')
    .addSeparator()
    .addItem('Análisis', 'generarAnalisis')
    .addSeparator()
    .addItem('Malla', 'generarMalla_pt5')
    .addSeparator()
    .addItem('Reiniciar colores', 'resetearColores')
    .addSeparator()
    .addItem('Malla avanzada', 'generarMallaAvanzada')
    .addToUi();
}
