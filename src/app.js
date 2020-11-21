const express = require("express");
const app = express();
const morgan = require("morgan");
const { PORT } = require("./utlis/constants");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.listen(PORT, (err) => {
  console.log(`Listening on ${PORT}`);
  if (err) {
    console.error(`Server can't start. Error: ${err}`);
  }
});
