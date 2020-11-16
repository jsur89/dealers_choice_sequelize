const {
  conn,
  syncAndSeed,
  models: { facility, member, booking },
} = require("./db/index");

const init = async () => {
  try {
    await conn.authenticate();
    await syncAndSeed();
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
  }
};

init();
