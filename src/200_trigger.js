'use strict';

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Utilities')
        .addItem('Validate JSON in current cell', 'validateJsonInCurrentCell')
        .addToUi();
}