const {
  conn,
  syncAndSeed,
  models: { facility, member, booking },
} = require("./db/db.js");

const express = require("express");
const app = express();

const init = async () => {
  try {
    await conn.authenticate();
    await syncAndSeed();
    console.log("*********");
    console.log("Connected to the Database");
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};
init();
