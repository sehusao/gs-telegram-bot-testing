'use strict';

function validateJsonInCurrentCell() {
    var value = SpreadsheetApp.getActiveRange().getValue();
    Helpers.validateJSON(value);
}

function convertJsToJson() {
    var aValue = SpreadsheetApp.getActiveRange().getValue();
    var jsonValid = false;
    try { 
        jsonValid = !!JSON.parse(aValue) 
    } catch { }

    var template = HtmlService.createTemplateFromFile('src\\jsToJson');
    template.jsonData = jsonValid ? aValue : '';
    
    var html = template.evaluate()
        .setWidth(600)
        .setHeight(400);
    
    SpreadsheetApp.getUi().showModalDialog(html, 'Enter JS object');
  }

/**
 * 
 * @param {string} json 
 */
function processConvertedJson(json) {
    var ui = SpreadsheetApp.getUi();
    
    var jsonValid = false;
    try { 
        jsonValid = !!JSON.parse(json) 
    } catch { }

    if (!jsonValid) {
        ui.alert('JSON invalid or empty');
        return;
    }

    var aCell = SpreadsheetApp.getActiveRange();
    var aValue = aCell.getValue();
    var response = ui.Button.YES;
    if (aValue) response = ui.alert('⚠️ Warning', `The current cell contains a value. Do you want to replace it?`, ui.ButtonSet.YES_NO)

    if (response !== ui.Button.YES) return;

    aCell.setValue(json);
}

