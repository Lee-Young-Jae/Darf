//passport 설정 파일

const passport = require("passport/lib");
const local = require("./local");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      done(null, user);
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  kakao();
  local();
};
