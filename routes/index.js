// const rootRoutes = require("./root");
const path = require('path');

const constructorMethod = (app) => {

    app.get('/', (req, res) => {
        res.render('general/frontpage');
    });
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;