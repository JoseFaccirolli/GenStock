const express = require("express");
const testConnect = require("./db/testConnect");

class AppController {
    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
        testConnect();
    }

    middlewares() {
        this.express.use(express.json());
    }

    routes(){
        const apiRoutes = require("./routes/apiRoutes");
        this.express.use("/stock", apiRoutes);
    }
}

module.exports = new AppController().express;
