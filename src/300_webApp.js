'use strict';

/**
 * 
 * @param {any} e 
 */
function doPost(e) {
    try {
        processDoPost(e);
    } catch (e) {
        errorAppend({
            functionName: 'doPost',
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
 * 
 * @param {any} e 
 */
function processDoPost(e) {
    /** @type {import('node-telegram-bot-api').Update} */
    var update = JSON.parse(e.postData.contents);

    var updateId = update?.update_id || '';
    var chatId = Helpers.extractChatIdFromUpdate(update);
    var userId = Helpers.extractUserIdFromUpdate(update);
    var body = JSON.stringify(update, null, CONST.JSON_SPACES);

    logAppend({
        direction: 'in',
        updateId,
        chatId,
        userId,
        body
    });
}
