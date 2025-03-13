'use strict';

/**
 * @returns {void}
 */
function onClick_SendRequest() {
    try {
        sendRequest();
    } catch (e) {
        errorAppend({
            functionName: 'onClick_SendRequest',
            error: e
        });
        if (CONST.ERRORS_ALERT) {
            var eComp = Helpers.errorToComponents(e);
            var errorMessage = `Error: ${eComp.name}\n\nMessage: ${eComp.message}\n\nStack: ${eComp.stack}`;
            SpreadsheetApp.getUi().alert(errorMessage);
        }
    }
}

/**
 * @returns {void}
 */
function sendRequest() {
    var sheet = SpreadsheetApp.getActiveSheet();
    var apiMethod = sheet.getSheetName();
    var botInfo = getBotInfo();
    var apiToken = botInfo.token

    if (!apiToken) throw new Error ('sendRequest !apiToken');

    var rows = sheet.getDataRange().getValues();
    
    var firstResultRow = getResponseResultFirstRow(rows);
    if (!firstResultRow) throw new Error ('sendRequest !firstResultRow');
    
    clearSheet(sheet, firstResultRow);

    var requestParams = getRequestParameters(rows);
    var response = Telegram.apiRequest(apiToken, apiMethod, requestParams);
    
    writeResponseResult(sheet, firstResultRow, response, requestParams);

    writeRequestToLog(apiMethod, botInfo, requestParams, response);
}

/**
 * 
 * @param {string} apiMethod 
 * @param {BotInfo} botInfo 
 * @param {any} requestParams 
 * @param {GoogleAppsScript.URL_Fetch.HTTPResponse} response 
 */
function writeRequestToLog(apiMethod, botInfo, requestParams, response) {
    var responseCode = response.getResponseCode();
    var responseText = response.getContentText();
    var parsedResponse;
    
    try {
        parsedResponse = JSON.parse(responseText);
    } catch (e) {}

    var apiToken = botInfo.token;
    var botDescription = botInfo.description;

    var requestUrl = Telegram.getApiRequestUrl(apiToken, apiMethod);

    var chatId = Helpers.extractChatIdFromOutMessage(requestParams);
    var body = JSON.stringify(requestParams, null, CONST.JSON_SPACES);
    var tgReplyOk = parsedResponse ? parsedResponse.ok : '';
    var tgReplyCode = responseCode;
    var tgReply = JSON.stringify(parsedResponse, null, CONST.JSON_SPACES);

    logAppend({
        direction: 'out',
        apiToken: apiToken,
        botDescription: botDescription,
        chatId: chatId,
        url: requestUrl,
        body: body,
        tgReplyOk: tgReplyOk,
        tgReplyCode: tgReplyCode,
        tgReply: tgReply
    });
}

/**
 * @typedef {object} BotInfo
 * @prop {string} token
 * @prop {string} description
 */

/**
 * 
 * @returns {BotInfo}
 */
function getBotInfo() {
    /** @type {BotInfo} */
    var info = {token: '', description: ''};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var curBotDescr = ss.getSheetByName(CONST.OPTIONS_SNAME)?.getRange(CONST.OPTIONS_CURBOT_CELL).getValue();

    if (!curBotDescr) return info;

    var rows = ss.getSheetByName(CONST.BOT_APIKEYS_SNAME)?.getDataRange().getValues() || [];

    for (var row of rows) {
        if (row[CONST.BOT_APIKEYS_DESC_COLNUM - 1] === curBotDescr) {
            info.token = row[CONST.BOT_APIKEYS_KEY_COLNUM - 1] || '';
            break;
        }
    }

    info.description = curBotDescr;
    return info;
}

/**
 * 
 * @param {any[][]} rows 
 * 
 * @returns {?number}
 */
function getResponseResultFirstRow(rows) {
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];

        if (row[CONST.RES_TAB_HDR_COL - 1] === CONST.RES_TAB_HDR_TXT) {
            var firstRow = i + 1 + CONST.RES_TAB_FRO;
            return firstRow;
        }
    }

    return null;
}

/**
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 
 * @param {number} firstResultRow 
 * 
 * @returns {void}
 */
function clearSheet(sheet, firstResultRow) {
    sheet.getRange(CONST.REQ_BODY_CELL).setValue('');
    sheet.getRange(CONST.RES_CODE_CELL).setValue('');
    sheet.getRange(CONST.RES_BODY_CELL).setValue('');
    clearResponseResult(sheet, firstResultRow);
}

/**
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 
 * @param {number} firstResultRow 
 * 
 * @returns {void}
 */
function clearResponseResult(sheet, firstResultRow) {
    var lastRow = sheet.getLastRow();
    if (lastRow < firstResultRow) return;
    sheet.getRange(firstResultRow, 1, lastRow - firstResultRow + 1, sheet.getLastColumn()).clearContent();
}

/**
 * 
 * @param {any[][]} rows 
 * 
 * @returns {any}
 */
function getRequestParameters(rows) {
    /** @type {any} */
    var parameters = {};
    var parametersStarted = false;

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];

        if (row[CONST.REQ_TAB_HDR_COL - 1] === CONST.REQ_TAB_HDR_TXT) {
            parametersStarted = true;
            i += CONST.REQ_TAB_FRO - 1;
        }

        if (parametersStarted) {
            var parameterName = row[CONST.REQ_TAB_PARAM_COLNUM - 1];
            if (!parameterName) return parameters;
            var parameterValue = row[CONST.REQ_TAB_VALUE_COLNUM - 1];
            var parameterType = `${row[CONST.REQ_TAB_TYPE_COLNUM - 1]}`.trim().toLowerCase();

            if (parameterValue) {
                switch (parameterType) {
                    case 'json':
                        parameters[parameterName] = JSON.parse(parameterValue);
                        break;
                    case 'number':
                        parameters[parameterName] = Number(parameterValue);
                        break;
                    case 'boolean':
                        parameters[parameterName] = `${parameterValue}`.trim().toLowerCase() === 'true';
                        break;
                    default:
                        parameters[parameterName] = parameterValue;
                }
            }
        }
    }

    return parameters;
}

/**
 * 
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 
 * @param {number} firstResultRow 
 * @param {GoogleAppsScript.URL_Fetch.HTTPResponse} response 
 * @param {any} requestParams 
 * 
 * @returns {void}
 */
function writeResponseResult(sheet, firstResultRow, response, requestParams) {
    var responseCode = response.getResponseCode();
    var respText = response.getContentText();
    var respParsed = JSON.parse(respText || '{}');

    sheet.getRange(CONST.REQ_BODY_CELL).setValue(JSON.stringify(requestParams, null, CONST.JSON_SPACES));
    sheet.getRange(CONST.RES_CODE_CELL).setValue(responseCode);
    sheet.getRange(CONST.RES_BODY_CELL).setValue(JSON.stringify(respParsed, null, CONST.JSON_SPACES));

    var result = responseCode === 200 ? respParsed.result : respParsed;

    var onlyValueTypes = ['number', 'string', 'boolean', 'undefined'];

    if (onlyValueTypes.includes(typeof result)) {
        var range = sheet.getRange(firstResultRow, 1, 1, sheet.getLastColumn());
        var values = range.getValues();
        
        values[0][CONST.RES_TAB_FIELD_COLNUM - 1] = 'result';
        values[0][CONST.RES_TAB_TYPE_COLNUM - 1] = typeof result;
        values[0][CONST.RES_TAB_VALUE_COLNUM - 1] = result;

        range.setValues(values);
    } else {
        var keys = Object.keys(result);
        if (keys.length === 0) return;

        var range = sheet.getRange(firstResultRow, 1, keys.length, sheet.getLastColumn());
        var values = range.getValues();

        keys.forEach((key, i) => {
            var curValue = result[key];
            /** @type {any} */
            var curTypeOf = typeof curValue;

            if (!onlyValueTypes.includes(curTypeOf)) {
                curTypeOf = Object.prototype.toString.call(curValue);
                curValue = JSON.stringify(curValue);
            }

            values[i][CONST.RES_TAB_FIELD_COLNUM - 1] = key;
            values[i][CONST.RES_TAB_TYPE_COLNUM - 1] = curTypeOf;
            values[i][CONST.RES_TAB_VALUE_COLNUM - 1] = curValue;
        });

        range.setValues(values);
    }
}





