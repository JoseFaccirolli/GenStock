const express = require("express");
require("dotenv-safe").config();
const testConnect = require("./database/testConnect");
const cors = require("cors");

class AppController {
    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
        testConnect();
    }

    middlewares() {
        this.express.use(express.json());
        this.express.use(cors({
            origin: [process.env.FRONT_URL, "http://localhost:5173"],
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        }));
    }

    routes(){
        const apiRoutes = require("./routes/apiRoutes");
        this.express.use("/", apiRoutes);
    }
}

module.exports = new AppController().express;
