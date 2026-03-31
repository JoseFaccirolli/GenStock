const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ auth: false, message: "Token not provided." });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            if(err.name == "TokenExpiredError"){
                return res.status(401).json({ auth: false, message: "Session expired." });
            }
            return res.status(403).json({ auth: false, message: "Token authentication failed." });
        }

        req.user = decoded; // id + type
        next();
    });
}

module.exports = verifyJWT;