require('dotenv').config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const { connectDB } = require("./db/mongo");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const todoRouter = require("./routes/todo");
const authRouter = require("./routes/auth");

const app = express();
app.use(cors({
  origin:"http://localhost:3000",
  credentials: true
}))
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "세션암호화비번",
  resave: false,
  saveUninitialized: false, 
  cookie: {
    maxAge: 1000 * 60 * 60, // 1시간 유지
  },
  store: MongoStore.create({
    mongoUrl: process.env.DB_URL,
    dbName: "schedy",
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

connectDB().then((client) => {
  const db = client.db("schedy");
  app.locals.db = db;
  global.db = db; 

  app.use("/api/todo", todoRouter);
  app.use("/api/auth", authRouter);

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
}).catch((err) => console.error("DB 연결 실패:", err));