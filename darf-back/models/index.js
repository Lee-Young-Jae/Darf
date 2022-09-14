const Sequelize = require("sequelize");
const config = require("../config/config")["development"]; // 배포시 수정할것.

const user = require("./user");
const diary = require("./diary");
const fooddata = require("./fooddata");
const width = require("./width");
const healthrecorddiet = require("./healthrecorddiet");
const healthrecordexercise = require("./healthrecordexercise");
const group = require("./group");
const grouppost = require("./grouppost");
const postcomment = require("./postcomment");
const dietimage = require("./dietimage");
const userprofile = require("./userprofile");

// node와 mySql연결
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  { timezone: "Asia/Seoul" }
);

const db = {};
db.User = user;
db.Diary = diary;
db.FoodData = fooddata;
db.Width = width;
db.HealthRecordDiet = healthrecorddiet;
db.HealthRecordExercise = healthrecordexercise;
db.Group = group;
db.GroupPost = grouppost;
db.PostComment = postcomment;
db.Image = dietimage;
db.UserProfile = userprofile;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

// 테이블 간 관계 연결
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
