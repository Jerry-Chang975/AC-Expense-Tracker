const exp = require("constants");
const express = require("express");
const app = express();

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}
const port = process.env.PORT || 3000;

// template engine
const { engine } = require("express-handlebars");
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));

app.listen(port, () => {
  console.log(`The app is running on http://localhost:${port}`);
});
