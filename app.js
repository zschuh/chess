const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const cookieParser = require('cookie-parser');

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

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});