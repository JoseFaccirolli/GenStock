const connect = require("./connect");

module.exports = async function testConnect(){
    try {
        const query = `SELECT "Sucessfull connection" AS Mensagem`;
        const [result] = await connect.execute(query);
            console.log(result[0].Mensagem);
    } catch (error) {
        console.error("Error executing SQL query. " + error);
    }
}