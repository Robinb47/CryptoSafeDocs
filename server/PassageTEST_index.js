// server.js
/*
const express = require('express');
const bodyParser = require('body-parser');
const webauthnController = require('./webauthnController.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// WebAuthn registration route
app.post('/webauthn/register', webauthnController.registerWebAuthn);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

*/

const Passage = require('@passageidentity/passage-node');

const passageConfig = {
  appID: ""
};

let passage = new Passage(passageConfig);
app.get('/authenticatedRoute', async(req, res) => {
  try {
    let userID = await passage.authenticateRequest(req, res);
    if(userID) {
      let userData = await passage.user.get(userID);
      console.log(userData);
    }
  } catch (e) {
    console.log(e);
    res.send("Authentication failed!");
  }
});

