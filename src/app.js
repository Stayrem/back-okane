const express = require("express");
const app = express();
const morgan = require("morgan");
const routes = require("./routes");
const { initDb } = require("./dataBase");
const { PORT, API_PREFIX } = require("./utlis/constants");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(API_PREFIX, routes);

initDb();

app.listen(PORT, (err) => {
  console.log(`Listening on ${PORT}`);
  if (err) {
    console.error(`Server can't start. Error: ${err}`);
  }
});
