const dialogflow = require('dialogflow');
const uuid = require('uuid');
const path = require('path');

const sessionClient = new dialogflow.SessionsClient({
  keyFilename: path.join(__dirname, 'automobilechatbot-sldj-92b74ce2e462.json'),
});

const projectId = 'automobilechatbot-sldj'; //

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
