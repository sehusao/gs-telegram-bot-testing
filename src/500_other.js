'use strict';

function validateJsonInCurrentCell() {
    var value = SpreadsheetApp.getActiveRange().getValue();
    Helpers.validateJSON(value);
}

