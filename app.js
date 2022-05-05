const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');

// handlebars stuff
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(cookieParser());

app.use(express.json());
// this lets the server return anything in the static folder without a route
app.use('/static', express.static(__dirname + '/static'));
// necessary to get the forms to work as expected
app.use(express.urlencoded({extended: true}));

app.use(
    session({
      name: 'AuthCookie',
      secret: "dooping my dino in the dunkin donuts parking lot",
      saveUninitialized: true,
      resave: false,
      cookie: {maxAge: 60000}
    })
  );

// Middleware
// Logging middleware, leaving this in for now
app.use(async (req, res, next) => {
    let authStr;
    if(req.session.user){ authStr="(Authenticated User)" } else { authStr="(Non-Authenticated User)" }
    console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} ${authStr}`);
    next();
});

// app.use('/private', async (req, res, next) => {
//     if(req.session.user){
//         next();
//     } else {
//         res.status(403).render('general/notLoggedin');
//     }
// });

configRoutes(app);

var server = app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

// socket.io work here for communicating between server/clients
const io = socketio(server);

// create an arr[2] to hold connections for chess game - length of 2 because first 2 people to 
// search will be matched together, anyone joining after will not be let in
// we do it this way for the sake of convenience for our project
const connections = [null, null];

io.on('connection', socket => {

  // fill up connections, give players indexes for identification
  let playerIndex = -1;
  for (const i in connections) {
    if (connections[i] === null) {
      playerIndex = i;
      break;
    }
  }

  // tell the connecting client what player number they are
  socket.emit('player-number', playerIndex);

  console.log(`Player ${playerIndex} has connected`);

  // ignore 3rd and beyond players connecting
  if (playerIndex === -1) return;

  // set connections to false when player is in the game but not ready, true when they select true
  // Marco: Defaulting this to true right now so I don't have to deal with a ready button
  connections[playerIndex] = true;

  // tell everyone who connected
  socket.broadcast.emit('player-connection', playerIndex);

  // disconnect
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`);
    connections[playerIndex] = null;
    // tell everyone who disconnected
    socket.broadcast.emit('player-connection', playerIndex);
  })

  // on ready up
  socket.on('player-ready', () => {
    // tell other client that their opponent readied up
    socket.broadcast.emit('opponent-ready', playerIndex);
    connections[playerIndex] = true;
  })

  socket.on('both-connected', () => {
    socket.broadcast.emit('show-chessboard');
  })

  socket.on('send-move', fenc => {
    // TODO: add the fencode to the database
    console.log("received move, forwarded");
    socket.broadcast.emit('receive-move', fenc);
  })

  // check player connections
  socket.on('check-players', () => { 
    const players = [];
    for (const i in connections) {
      connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] });
    }
    socket.emit('check-players', players);
  })

  // chat received 
  socket.on('chat', msg => {
    console.log(`Message sent from ${playerIndex}: `, msg);

    // send message to the other player 
    socket.broadcast.emit('chat', [playerIndex, msg]);
  })

  setTimeout(() => {
    connections[playerIndex] = null;
    socket.emit('timeout');
    socket.disconnect();

  }, 600000) // 10 minutes then timeout
})