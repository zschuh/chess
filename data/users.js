const validation = require('./validation');
const mongoCollections = require('./../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

async function createUser(email, username, password) {
    // email input checking
    validation.checkEmail(email);
    // username input checking
    validation.checkUsername(username);
    // password input checking
    validation.checkPassword(password);

    const userCollection = await users();

    // set email to lowercase in database then check if email is already in database
    email = email.toLowerCase();
    const emailCheck = await userCollection.findOne({ email: email });
    if (emailCheck) { throw 'There is already an account associated with this email address' }

    // Check if username passed to the function (second username in the query) is already stored in the database
    // store user as lower case because usernames are case-insensitive
    username = username.toLowerCase();
    const userCheck = await userCollection.findOne({ username: username }); 
    if (userCheck) { throw 'There is already a user with this username' }

    // Hash password to be stored in database
    const saltRounds = 14;
    const hash = await bcrypt.hash(password, saltRounds);

    // Store user
    let user = {
        email: email,
        username: username,
        password: hash,
        rating: 0,
        gamesPlayed: [] // array of game ID's
    };
    const insertInfo = await userCollection.insertOne(user);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Could not add the user to the database' }

    // success
    return {userInserted: true};
} 

// Use for logins
async function checkUser(username, password) {
    // username input checking
    validation.checkUsername(username);
    // password input checking
    validation.checkPassword(password);

    const userCollection = await users();

    // Check if supplied username is already in database
    username = username.toLowerCase();
    const userCheck = await userCollection.findOne({ username: username });
    if (!userCheck) { throw 'Either the username or password is invalid' }
    
    // Check if supplied password is equal to the hashed password corresponding to the given username
    let comparePass = false;
    comparePass = await bcrypt.compare(password, userCheck.password);
    if (!comparePass) { throw 'Either the username or password is invalid' }

    // success, user is in database
    return {authenticated: true};
}

// Use for getting user after signup/login or after authentication check, in order to relay the user information back to
// ajax calls if need be
async function getUser(username) {
    // username input checking
    validation.checkUsername(username);

    username = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) { throw 'Could not get user' }

    // Return user's ID as just the number (in string form), not the ObjectID
    user._id = user._id.toString();
    return user;
}   

/**
 * Updates the player in the user database with the ID of the played game.
 * @param {string} username The user to update
 * @param {mongoDB ID} gameId The id of the game in the games collection
 * @returns The game ID that was added
 */
async function updatePlayerWithGame(username, gameId){
    validation.checkUsername(username);
    // need to check if the game id is a valid mongo game id
    if(!ObjectId.isValid(gameId)) throw "Error with 'gameId' argument: gameId is not valid";

    let res = await getUser(username);
    if(res.gamesPlayed.includes(gameId)) throw `Error: gameId ${gameId} already exists for player ${username}`;
    res.gamesPlayed.push(gameId);

    const userCollection = await users();
    // add the user back to the database
    const updatedInfo = await userCollection.replaceOne({_id:res._id}, res);
    return gameId;
}

module.exports = {
    createUser,
    checkUser,
    getUser,
    updatePlayerWithGame
};