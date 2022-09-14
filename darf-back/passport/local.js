const passport = require("passport");

const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { userEmail: email },
          });

          if (!user) {
            return done(null, false, {
              reason: "존재하지 않는 사용자 입니다.",
            });
          }
          const bcryptResult = await bcrypt.compare(password, user.password);

          // 비밀번호 불일치
          if (!bcryptResult) {
            return done(null, false, {
              reason: "비밀번호가 일치하지 않습니다.",
            });
          }
          return done(null, user);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
