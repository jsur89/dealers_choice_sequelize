const {
  conn,
  syncAndSeed,
  models: { Facility, Member, Booking },
} = require("./db/db.js");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "./assets")));
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res, next) => {
  try {
    const members = await Member.findAll({
      include: [
        { model: Member, as: "sponsor" },
        { model: Member, as: "sponsored" },
      ],
    });
    res.send(members);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/facilities", async (req, res, next) => {
  try {
    res.send(
      await Facility.findAll({
        include: [Booking],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/facilities2", async (req, res, next) => {
  try {
    const facility = await Facility.findByPk(req.params.id, {
      include: ["idk"],
    });
    const html = `<!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <h1> Brooklyn Country Club Facilities</h1>
        <ul>

        </ul>
      <body>
    </html>
    `;
    res.send(html);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/members", async (req, res, next) => {
  try {
    res.send(
      await Member.findAll({
        include: [
          { model: Member, as: "sponsor" },
          { model: Member, as: "sponsored" },
        ],
      })
    );
  } catch (ex) {
    next(ex);
  }
});
app.get("/api/bookings", async (req, res, next) => {
  try {
    res.send(
      await Booking.findAll({
        include: [{ model: Member, as: "bookedBy" }, Facility],
      })
    );
  } catch (ex) {
    next(ex);
  }
});

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

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });
