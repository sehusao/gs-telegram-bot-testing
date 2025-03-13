'use strict';

/** 
 * @typedef {object} ErrorComponents
 * @prop {string} name
 * @prop {string} message
 * @prop {string} stack
 */

/**
 * @typedef {import('node-telegram-bot-api').Update} Update
 */

var Helpers = Object.freeze({ 
    /**
     * 
     * @param {any} value 
     */
    validateJSON: (value) => {
        try {
            var parsed = JSON.parse(value);
            var stringified = JSON.stringify(parsed, null, CONST.JSON_SPACES);
            SpreadsheetApp.getUi().alert(`JSON valid:\n\n${stringified}`);
        } catch (e) {
            if (e instanceof Error) {
                var errTxt = `e.name:\n${e.name}\n\ne.message:\n${e.message}\n\ne.stack:\n${e.stack}`;
                SpreadsheetApp.getUi().alert(`JSON invalid:\n\n${errTxt}`);
            }
        }
    },

    /**
     * 
     * @param {any} error 
     * 
     * @returns {ErrorComponents}
     */
    errorToComponents: (error) => {
        return {
            name: error instanceof Error ? error.name || '' : '',
            message: error instanceof Error ? error.message || '' : '',
            stack: error instanceof Error ? error.stack || '' : ''
        };
    },

    /**
     *  @param {Update} params
     * 
     *  @returns {string}
     * */
    extractUserIdFromUpdate: (params) => {
        return `${params?.message?.from?.id || 
               params?.callback_query?.from?.id || 
               params?.edited_message?.from?.id || 
               params?.inline_query?.from?.id || 
               params?.shipping_query?.from?.id || 
               params?.pre_checkout_query?.from?.id || 
               params?.my_chat_member?.from?.id || 
               params?.chat_member?.from?.id || 
               params?.chat_join_request?.from?.id || 
               ''}`;
    },

    /**
     *  @param {Update} params
     * 
     *  @returns {string}
     * */
    extractChatIdFromUpdate: (params) => {
        return `${params?.message?.chat?.id || 
                params?.callback_query?.message?.chat?.id || 
                params?.edited_message?.chat?.id || 
                params?.channel_post?.chat?.id || 
                params?.edited_channel_post?.chat?.id || 
                params?.my_chat_member?.chat?.id || 
                params?.chat_join_request?.chat?.id || 
                ''}`;
    },

    /**
     *  @param {any} params
     * 
     *  @returns {string}
     * */
    extractChatIdFromOutMessage: (params) => {
        return `${params.chat_id || 
                ''}`;
    },
});