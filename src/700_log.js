'use strict';

/**
 * 
 * @param {object} [options]
 * @param {Date} [options.date] 
 * @param {string} [options.direction]
 * @param {string} [options.apiToken] 
 * @param {string} [options.botDescription] 
 * @param {string | number} [options.updateId] 
 * @param {string | number} [options.chatId] 
 * @param {string | number} [options.userId] 
 * @param {string} [options.url] 
 * @param {string} [options.body] 
 * @param {string} [options.tgReplyOk] 
 * @param {number} [options.tgReplyCode] 
 * @param {string} [options.tgReply] 
 */
function logAppend(options = {}) {
    var {
        date = new Date(),
        direction = '',
        apiToken = '',
        botDescription = '',
        updateId = '',
        chatId = '',
        userId = '',
        url = '',
        body = '',
        tgReplyOk = '',
        tgReplyCode = '',
        tgReply = '',
    } = options;
    
    SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(CONST.LOG_SNAME)
        ?.appendRow([date, direction, apiToken, botDescription, updateId, chatId, userId, url, body, tgReplyOk, tgReplyCode, tgReply]);
}

/**
 * 
 * @param {object} [options] 
 * @param {Date} [options.date]
 * @param {string} [options.functionName]
 * @param {any} [options.error]
 */
function errorAppend(options = {}) {
    var {
        date = new Date(),
        functionName = '',
        error = ''
    } = options;

    var eComp = Helpers.errorToComponents(error);
    
    SpreadsheetApp.getActiveSpreadsheet()
        .getSheetByName(CONST.ERROR_SNAME)
        ?.appendRow([date, functionName, eComp.name, eComp.message, eComp.stack]);
}

