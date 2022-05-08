const express = require('express');
const router = express.Router();
const users = require('../data/users');
const validation = require('../data/validation');
const xss = require('xss');

// when logged in, button is rendered at the top of page - clicking it destroys the session and redirects to homepage
router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// '/' route == homepage
router.get('/', async (req, res) => {
    if (req.session.username) {
        res.status(200).render('general/frontPage', { loggedIn: true });
    }
    else {
        res.status(200).render('general/frontPage');
    }
});

router.get('/user', async (req, res) => {
    if (req.session.username) {
        res.status(200).render('general/user', {    jsfiles: ['static/js/userform.js', '/socket.io/socket.io.js'],
                                        loggedIn: true,
                                        user: req.session.username });
    }
    else {
        res.status(200).render('general/user', { jsfiles: ['static/js/userform.js', '/socket.io/socket.io.js'] });
    }
});

// route called by client-side ajax functions that need to get user data to display on page
router.get('/userdata', async (req, res) => {
    let username = req.session.username;
    let user;
    // validate user
    try {
        validation.checkUsername(username);
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }

    // get user's data
    try {
        user = await users.getUser(username);
    } catch (e) {
        res.status(500).json({ error: e });
        return;
    }
    // respond with user data
    res.status(200).json({ userData: user });
    
});

// plan on having this route be called by ajax call
// in order to relay user info from database, then jquery the page with that info
router.post('/user', async (req, res) => {
    // meaning if only username and password were passed, so it's logging in using checkUser(username, password)
    if (Object.keys(req.body).length === 2) {
        let username = xss(req.body.username);
        let password = xss(req.body.password);
        let checkedUser;

        // validate user and pass
        try {
            validation.checkUsername(username);
            validation.checkPassword(password);
        } catch (e) {
            // respond to ajax with something to jquery an error message and don't hide the login
            res.status(500).json({ error: e });
            return;
        }

        // Check if given user/pass is a user in the database
        try {
            checkedUser = await users.checkUser(username, password);
        } catch (e) {
            // respond with something to jquery an error message, don't hide login (user or password is incorrect)
            res.status(500).json({ error: e });
            return;
        }
        // if user logs in, set session & tell ajax call that user is logged in so it can populate the user page with data
        if (checkedUser.authenticated === true) {
            req.session.username = username;
            res.status(200).json({ success: true });
        }
    }

    // meaning email, user and pass were given, so it's trying to create an account using createUser(email, user, pass)
    if (Object.keys(req.body).length === 3) {
        //console.log(typeof req.body.email);
        let email = xss(req.body.email);
        let username = xss(req.body.username);
        let password = xss(req.body.password);
        let createdUser;

        // validate email, user, and pass
        try {
            validation.checkEmail(email);
            validation.checkUsername(username);
            validation.checkPassword(password);
        } catch (e) {
            // respond to ajax with something to jquery an error message and don't hide the login
            res.status(500).json({ error: e });
            return;
        }

        // Create user
        try {
            createdUser = await users.createUser(email, username, password);
        } catch (e) {
            // respond that user/email already used
            res.status(500).json({ error: e });
            return;
        }
        // if user was created, set session & tell ajax call that user is created so it can populate the user page with data
        if (createdUser.userInserted === true) {
            req.session.username = username;
            res.status(200).json({ success: true });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
    }
});

// Set this to TRUE to ignore the login check the game page.
const TESTING_OVERRIDE = false;
router.get('/game', async (req, res) => {
    if (req.session.username || TESTING_OVERRIDE) {
        res.status(200).render('general/game', {    jsfiles: ['static/js/game.js', '/socket.io/socket.io.js', 'static/js/chessboard-1.0.0.js'],
                                        loggedIn: true,
                                        passedVars: [
                                            {varName: 'userId', varValue: req.session.username }
                                        ]});
    }
    else {
        // person is trying to access the game but they're not logged in
        // Redirect them to the user login page
        res.redirect('/user');
    }
    });
    
router.get('/leaderboard', async (req, res) => {
        //Sorted array of every user eligible for the boards
        let sortedBoard = await users.getRankings();
        //This is gonna change with css -zac
        let leaderboardSize = 15;
        //Passing the first leaderboardSize elements to be added to the boards (sets loggedIn variable based on session validation)
        res.render('general/leaderboard', { loggedIn: (req.session.username ? true : false), board: sortedBoard.slice(0, leaderboardSize) }).status(200);
});

router.get('/credits', async (req, res) => {
    res.status(500).render('general/credits');
})

// Currently unused.
// router.get('/results', async (req, res) => {
//     if (req.session.username) {
//         res.render('general/results', { loggedIn: true });
//     }
//     else {
//         // res.render('general/results');
//         if(TESTING_OVERRIDE) {
//             res.render('general/results', { loggedIn: true });
//         } else{
//             res.redirect('/user');
//         }
//     }
// });

module.exports = router;