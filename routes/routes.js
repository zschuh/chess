const express = require('express');
const router = express.Router();
// require database functions once implemented

// '/' route == homepage
router.get('/', async (req, res) => {
    res.render('general/frontPage');
});

router.get('/user', async (req, res) => {
    res.render('general/user', { jsfiles: ['static/js/userform.js', '/socket.io/socket.io.js'] });
});

// plan on having this route be called by ajax call
// in order to relay user info from database, then jquery the page with that info
router.post('/user', async (req, res) => {

});

router.get('/game', async (req, res) => {
    res.render('general/game', { jsfiles: ['static/js/game.js', '/socket.io/socket.io.js'] });
});

router.get('/leaderboard', async (req, res) => {
    res.render('general/leaderboard');
});

router.get('/results', async (req, res) => {
    res.render('general/results');
});

module.exports = router;