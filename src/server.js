const app = require("./index");
const port = 5000;

app.listen(port, "0.0.0.0", () => {
  console.log("API running on port:", port);
});
