// const rootRoutes = require("./root");
const path = require('path');
const routes = require('./routes');

const constructorMethod = (app) => {
    app.use('/', routes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;