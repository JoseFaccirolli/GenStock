const connect = require("./connect");

module.exports = function testConnect(){
    try {
        const query = `SELECT "Sucessfull connection" AS Mensagem`;
        connect.query(query, function(err){
            if(err){
                console.log("Conection not established. " + err);
                return;
            }
            console.log("Conection established with MySQL.");
        })
    } catch (error) {
        console.error("Error executing SQL query. ", error);
    }
}