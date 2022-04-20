// const rootRoutes = require("./root");
const constructorMethod = (app) => {

    // app.use('/', rootRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;