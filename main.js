function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Menu Tarea 2')
    .addItem('Colorear curso', 'colorearCurso')
    .addSeparator()
    .addItem('Dependientes', 'agregarDependientes')
    .addSeparator()
    .addItem('Análisis', 'generarAnalisis')
    .addSeparator()
    .addItem('Malla', 'generarMalla')
    .addSeparator()
    .addItem('Reiniciar colores', 'resetearColores')
    .addToUi();
}
