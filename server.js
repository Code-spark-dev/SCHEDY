require('dotenv').config();
const express = require("express");
const methodOverride = require("method-override");
const { connectDB } = require("./db/mongo");

const todoRouter = require("./routes/todo");
// const calendarRouter = require("./routes/calendar");
// const authRouter = require("./routes/auth");

const app = express();
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then((client) => {
    app.locals.db = client.db("schedy");

    app.use("/api/todo", todoRouter);
    // app.use("/calendar", calendarRouter);
    // app.use("/auth", authRouter);

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`서버 실행 중: localhost:${PORT}`));
  });