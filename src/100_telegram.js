'use strict';

var Telegram = Object.freeze({
    /**
     * 
     * @param {string} apiToken 
     * @param {string} apiMethod 
     * @param {Object} [payload] 
     * 
     * @returns {GoogleAppsScript.URL_Fetch.HTTPResponse}
     */
    apiRequest: (apiToken, apiMethod, payload = {}) => {
        var url = Telegram.getApiRequestUrl(apiToken, apiMethod);

        /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
        var options = {
            method: 'post',
            contentType: 'application/json; charset=utf-8',
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        };

        var response = UrlFetchApp.fetch(url, options);

        return response;
    },

    /**
     * 
     * @param {string} apiToken 
     * @param {string} apiMethod 
     */
    getApiRequestUrl: (apiToken, apiMethod)  => {
        return `https://api.telegram.org/bot${apiToken}/${apiMethod}`;
    }
});

