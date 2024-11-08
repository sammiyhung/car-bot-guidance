const dialogflow = require('dialogflow');
const uuid = require('uuid');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, 'automobilechatbot-sldj-2636c8607d89.json'),
});

const projectId = 'automobilechatbot-sldj'; // Replace with your Dialogflow project ID

async function detectIntent(queryText) {
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: queryText,
        languageCode: 'en-US',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
}

module.exports = { detectIntent };
