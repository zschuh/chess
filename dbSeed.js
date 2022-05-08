const connection = require('./config/mongoConnection');
const userFuncs = require('./data/users'); 
const gameFuncs = require('./data/games');
const { ObjectId } = require ('mongodb');
const { json } = require('express/lib/response'); // not sure if i need this

async function seed(){
    console.log("Beginning database seed (This may take a while...)");
    const db = await connection.connectToDb();

    // If you pass in true as the argument it will drop the original db
    if(process.argv[2]){
        try{
            await db.collection('users').drop();
        } catch (e) {
            console.log("collection does not exist yet or some other drop error; continuing;");
        }
    }

    // ------------------ USER CREATION -----------------------------
    try{
        await userFuncs.createUser('marriaga@stevens.edu', 'kelp', 'secure-password');
        await userFuncs.createUser('zschuh@stevens.edu', 'zschuh', 'secure-password');
        await userFuncs.createUser('nchriste@stevens.edu', 'nchriste', 'secure-password');
        await userFuncs.createUser('xaviles@stevens.edu', 'xaviles', 'secure-password');
        await userFuncs.createUser('seeduser1@gmail.com', 'seed1', 'secure-password');
        await userFuncs.createUser('seeduser2@gmail.com', 'seed2', 'secure-password');
        await userFuncs.createUser('seeduser3@gmail.com', 'seed3', 'secure-password');
        await userFuncs.createUser('seeduser4@gmail.com', 'seed4', 'secure-password');
        await userFuncs.createUser('seeduser5@gmail.com', 'seed5', 'secure-password');
        await userFuncs.createUser('seeduser6@gmail.com', 'seed6', 'secure-password');
        await userFuncs.createUser('seeduser7@gmail.com', 'seed7', 'secure-password');
        await userFuncs.createUser('seeduser8@gmail.com', 'seed8', 'secure-password');
        await userFuncs.createUser('seeduser9@gmail.com', 'seed9', 'secure-password');
        await userFuncs.createUser('seeduser10@gmail.com', 'seed10', 'secure-password');
        await userFuncs.createUser('seeduser11@gmail.com', 'seed11', 'secure-password');
        await userFuncs.createUser('seeduser12@gmail.com', 'seed12', 'secure-password');
        await userFuncs.createUser('seeduser13@gmail.com', 'seed13', 'secure-password');
        await userFuncs.createUser('seeduser14@gmail.com', 'seed14', 'secure-password');
        await userFuncs.createUser('seeduser15@gmail.com', 'noleaderboards', 'secure-password');

        let theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver = ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', 'rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2', 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3', 'rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq - 0 3', 'rnbqkb1r/pppp1ppp/5n2/8/4Pp2/2N5/PPPP2PP/R1BQKBNR w KQkq - 0 4', 'rnbqkb1r/pppp1ppp/5n2/4P3/5p2/2N5/PPPP2PP/R1BQKBNR b KQkq - 0 4', 'rnbqkbnr/pppp1ppp/8/4P3/5p2/2N5/PPPP2PP/R1BQKBNR w KQkq - 1 5', 'rnbqkbnr/pppp1ppp/8/4P3/3P1p2/2N5/PPP3PP/R1BQKBNR b KQkq - 0 5', 'rnb1kbnr/pppp1ppp/8/4P3/3P1p1q/2N5/PPP3PP/R1BQKBNR w KQkq - 1 6', 'rnb1kbnr/pppp1ppp/8/4P3/3P1p1q/2N5/PPP1K1PP/R1BQ1BNR b kq - 2 6', 'rnb1kbnr/ppp2ppp/3p4/4P3/3P1p1q/2N5/PPP1K1PP/R1BQ1BNR w kq - 0 7', 'rnb1kbnr/ppp2ppp/3p4/4P3/3P1p1q/2N2N2/PPP1K1PP/R1BQ1B1R b kq - 1 7', 'rn2kbnr/ppp2ppp/3p4/4P3/3P1pbq/2N2N2/PPP1K1PP/R1BQ1B1R w kq - 2 8', 'rn2kbnr/ppp2ppp/3p4/4P3/3P1pbq/2N2N2/PPP1K1PP/R1B1QB1R b kq - 3 8', 'rn2kbnr/ppp2ppp/3p4/4P3/3P1pb1/2N2N2/PPP1K1PP/R1B1qB1R w kq - 0 9', 'rn2kbnr/ppp2ppp/3p4/4P3/3P1pb1/2N2N2/PPP3PP/R1B1KB1R b kq - 0 9', 'r3kbnr/ppp2ppp/2np4/4P3/3P1pb1/2N2N2/PPP3PP/R1B1KB1R w kq - 1 10'];

        for (let i = 0; i < 20; i++){
            //White or black
            await gameFuncs.createGame('kelp', 'zschuh', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('nchriste', 'xaviles', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed1', 'seed2', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed3', 'seed4', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed5', 'seed6', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed7', 'seed8', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed9', 'seed10', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed11', 'seed12', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        for (let i = 0; i < 20; i++){
            await gameFuncs.createGame('seed13', 'seed14', ((Math.floor(Math.random() * 2) === 0) ? 'white' : 'black'), theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        }
        await gameFuncs.createGame('seed13', 'noleaderboards', 'black', theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);
        await gameFuncs.createGame('seed13', 'noleaderboards', 'black', theOnlyGamesMoveListThatIFeelLikeCommandingNickToLaborOver);

    } catch(e) {
        console.log(e);
        return;
    }

    console.log("I have given you my seed.");
    connection.closeConnection();
}

seed();