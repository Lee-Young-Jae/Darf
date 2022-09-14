const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./models");
const passport = require("passport");
const passportConfig = require("./passport");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const userRouter = require("./routes/user");
const diaryRouter = require("./routes/diary");
const foodRouter = require("./routes/food");
const healthRecordRouter = require("./routes/healthRecord");
const groupRouter = require("./routes/group");

const app = express();
// npx sequelize db:create  //데이터베이스 생성
db.sequelize
  .sync()
  .then(() => {
    console.log("app.js | DB연결 성공...");
  })
  .catch(console.error);

passportConfig();
//get -> 가져올때  (데이터 캐싱가능 쿼리스트링같은거)
//post -> 생성할때 (뿐만아니라 애매하면 다 post쓰자)
//put -> 전체 수정
//patch -> 부분수정 (예를들면 비밀번호만 변경)
//delete -> 제거
//options -> 찔러보기(?)
//head -> 헤더만 가져오기

// 앱 미들웨어
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use(express.json()); //req.body에 json데이터 저장
app.use(express.urlencoded({ extended: true })); //req.body에 formData 저장
app.use(
  cors({
    origin: true,
    credentials: true,
  })
); // Cross Origin Resource Service(?) 문제 해결
app.use(cookieParser(process.env.COOKIE_HASH_KEY));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_HASH_KEY,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(201).send("서버 살아 있음!");
});

app.use("/api/user", userRouter);
app.use("/api/diary", diaryRouter);
app.use("/api/food", foodRouter);
app.use("/api/healthRecordRouter", healthRecordRouter);
app.use("/api/group", groupRouter);

app.listen(3065, () => {
  console.log("BackEnd Server Running!!");
});

// app.js 를 실행을 하면 node 런타임이 code를 실행해서 http가 서버역할을 해준다.
