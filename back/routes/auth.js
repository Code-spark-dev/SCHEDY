const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

/* 로그인 확인 LocalStrategy 라이브러리 사용법 */
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const result = await global.db.collection("user").findOne({ username });
      if (!result) return cb(null, false, { message: "존재하지 않는 아이디입니다." });

      const isMatch = await bcrypt.compare(password, result.password);
      if (isMatch) return cb(null, result);
      else return cb(null, false, { message: "비밀번호가 올바르지 않습니다." });
    } catch (err) {
      cb(err);
    }
  })
);

/* 로그인 성공시 세션에 정보 저장 */
passport.serializeUser((user, done) => {
  done(null, user._id);
});

/* 재로그인시 세션에서 해당 정보 복구 */
passport.deserializeUser(async (id, done) => {
  try {
    const result = await global.db
      .collection("user")
      .findOne({ _id: new ObjectId(id) });
    if (!result) return done(null, false);
    delete result.password;
    done(null, result);
  } catch (err) {
    done(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) return res.status(500).json({ message: "서버 오류", error });
    if (!user) return res.status(401).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({
        message: "로그인 성공",
        user: {
          id: user._id,
          username: user.username,
        },
      });
    });
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const exists = await global.db.collection("user").findOne({ username });
    if (exists) return res.status(400).json({ message: "이미 존재하는 아이디입니다." });

    const hash = await bcrypt.hash(password, 10);
    await global.db.collection("user").insertOne({
      username,
      password: hash,
    });
    res.status(200).json({ message: "회원가입 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 중 오류 발생" });
  }
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });
    res.status(200).json({ message: "로그아웃 성공" });
  });
});

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ isLoggedIn: true, user: req.user });
  } else {
    return res.status(200).json({ isLoggedIn: false });
  }
});

module.exports = router;