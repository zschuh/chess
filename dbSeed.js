const connection = require('./config/mongoConnection');
const userFuncs = require('./data/users'); 
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
    } catch(e) {
        console.log(e);
        return;
    }

    console.log("Seed Complete.");
    connection.closeConnection();
}

seed();