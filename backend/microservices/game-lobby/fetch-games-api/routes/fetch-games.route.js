const express = require('express');
const router = express.Router();

const FetchController = require('../controllers/fetch-games.controller');
const Auth = require('../middleware/user.auth.js');

router.get('/', Auth.verifyAPIUser, (req, res) => {
    FetchController.getTriviaGames()
        .then((result) => {
            res.status(result.statusCode).send(result.body);
        })
        .catch((error) => {
            res.status(500).send({ message: 'Internal server error', error: error });
        });
});

module.exports = router;
