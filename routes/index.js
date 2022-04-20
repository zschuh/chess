// const rootRoutes = require("./root");
const path = require('path');

const constructorMethod = (app) => {

    app.get('/', (req, res) => {
        res.sendFile(path.resolve("static/default.html"));
    });
    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;