# Telegram Bot API testing in Google Sheets

This project provides an easy way to experiment with various Telegram Bot API methods using Google Sheets. You can explore the process of constructing API request parameters, understand the structure of responses, and interact with multiple bots. The Spreadsheet also stores request history and can save incoming bot updates.

## Link to Spreadsheet

[https://docs.google.com/spreadsheets/d/1Gr3cQ34Vl9-JczegxD-wG-0TeEHHsE86_RIlsmKi_H8/edit](https://docs.google.com/spreadsheets/d/1Gr3cQ34Vl9-JczegxD-wG-0TeEHHsE86_RIlsmKi_H8/edit)

## Features

- **Interact with multiple Telegram bots**: The sheet supports multiple bots, and you can easily switch between them.
- **Experiment with Telegram Bot API methods**: Try out different methods of the Telegram Bot API, understand the required parameters, and test the responses directly in Google Sheets.
- **Request History**: All your requests are logged in the **Log** tab, making it easy to track your interactions with the API.
- **Handle Incoming Bot Updates**: The sheet can store incoming updates from the bot, allowing you to see and manage them.
- **Easy Parameter Handling**: Automatically manage API parameters and ensure they are in the correct format (e.g., valid JSON).

## Usage

1. **Add your tokens to the API tokens sheet**  
   Input your API tokens in the corresponding sheet to authenticate requests.
   
2. **Select the bot you want to use on the Options sheet**  
   Choose the bot you want to interact with from the available options.

3. **Go to the sheet corresponding to the API method you want to use**  
   Navigate to the sheet that corresponds to the desired API method for the bot.

4. **Enter the parameters in the Request parameters section and click "Send request"**  
   Fill in the required parameters for the API method and send the request to the API.

## Notes

1. Leave the parameters that do not need to be included in the request empty.
2. The values of fields with the type "json" must be valid JSON text.
3. To check the validity of the JSON text, you can use **"Validate JSON in current cell"** from the Utilities menu.
4. You can view the request history on the **Log** page.
5. Script errors are stored in the **Error** sheet and are also displayed in a message on the screen.

## Handling Updates from the Bot

1. **Deploy the script as a web app accessible to anyone**  
   Set the script up as a web app so that it can accept requests from the bot.

2. **Use `setWebHook` to set the script as a bot update handler**  
   Configure the script to handle incoming updates from the bot using `setWebHook`.

### Notes:

1. Bot updates will be stored on the **Log** tab.
2. Errors that occur while processing bot updates are stored in the **Error** sheet.

## Adding API Methods

1. **Copy the Template sheet**  
   Duplicate the Template sheet to create a new method.

2. **Name it with the name of the required method**  
   Rename the sheet according to the method you want to use (e.g., `setMessageReaction`, `setChatTitle`, or any other method).

3. **Enter parameters in the Request parameters section. Add rows if needed.**  
   Provide the necessary parameters for the method, and add more rows if additional parameters are required.

4. **Use it like all the other methods**  
   Follow the same structure and steps used for other methods to ensure consistency.

## Contact

[Telegram @Sehusao](https://t.me/Sehusao).
