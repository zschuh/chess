const validation = require('./validation');
const mongoCollections = require('./../config/mongoCollections');
const games = mongoCollections.games;
const userData = require('../data/users');
const { users } = require('../config/mongoCollections');

/**
 * Takes in the usernames and a single move list array and generates an entry in the
 * games database. Also updates the 'games-played' attribute of the users in the 'users'
 * database.
 * @param {String} whiteUsername The username of the player who played white
 * @param {String} blackUsername The username of the player who played black
 * @param {String} winner The result of the game. Valid strings are [black, white, draw]
 * @param {Array} moveList The array of moves made in the game
 * @returns The ID of the created game.
 */
async function createGame(whiteUsername, blackUsername, winner, moveList){
    const gamesCollection = await games();

    let whiteMoves = [];
    let blackMoves = [];
    for(let i=0;i<moveList.length;i++){
        if(i%2==0){
            // white move
            whiteMoves.push(moveList[i]);
        } else {
            blackMoves.push(moveList[i]);
        }
    }

    // Shouldn't be necessary, adding for validation redundancy
    validation.checkUsername(whiteUsername);
    validation.checkUsername(blackUsername);

    let game = {
        whiteplayer: whiteUsername,
        blackplayer: blackUsername,
        winner: winner,
        movelist: {
            // I believe this counts as a subdocument
            white: whiteMoves,
            black: blackMoves
        }
    };

    const insertInfo = await gamesCollection.insertOne(game);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) { throw 'Could not add the user to the database' }
    console.log(`inserted new game with id ${insertInfo.insertedId}`);

    // for code simplicity; constprop takes care of this anyway
    let gameId = insertInfo.insertedId; 

    try {
        await userData.updatePlayerWithGame(whiteUsername, gameId);
        await userData.updatePlayerWithGame(blackUsername, gameId);
    } catch(e) {
        throw `Error updating player: ${e}`;
    }

    return gameId;
}

/**
 * 
 * @param {MongoDB ID} gameId 
 * @returns The game object from the database
 */
async function getGame(gameId){
    if(!ObjectId.isValid(gameId)) throw "Error with 'gameId' argument: gameId is not valid";

    const gameCollection = await games();
    const game = await userCollection.findOne({_id:gameId});
    if(!game) throw 'Could not get game';

    return game;
}

module.exports = {
    createGame,
    getGame
}