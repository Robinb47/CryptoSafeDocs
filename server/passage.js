const Passage = require('@passageidentity/passage-node');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOption));

let passageConfig = {
    appID: 'swni5tN408lF8CQAWVwxli4d',
};


// example of custom middleware
let passage = new Passage(passageConfig);
let passageAuthMiddleware = (() => {
    return async (req, res, next) => {
        await passage
            .authenticateRequest(req)
            .then((userID) => {
                if (userID) {
                    res.userID = userID;
                    return next();
                } else return res.status(401).send('unauthorized');
            })
            .catch(() => {
                return res.status(401).send('Could not authenticate user!');
            });
    };
})();

// example implementation of custom middleware
app.get('/authenticatedRoute', passageAuthMiddleware, async (req, res) => {
    // authenticated user
    let userID = res.userID;
});



app.listen(port, () => {
    console.log(`Example app running at http://localhost:3000`);
});