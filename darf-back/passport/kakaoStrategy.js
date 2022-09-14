const passport = require("passport");
const { Strategy: KakaoStrategy } = require("passport-kakao");

const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        //배포시 수정
        clientID: "aa7db4556bd6d650e2c052510c7855da", //REST API KEY
        callbackURL: "http://localhost:3065/api/user/callback/kakao", //Redirect URL
      },
      async (accessToken, refreshToken, profile, done) => {
        //authorization 에 성공했을때의 액션
        console.log(`accessToken : ${accessToken}`);
        console.log(`사용자 profile: ${JSON.stringify(profile._json)}`);

        try {
          const exUser = await User.findOne({
            where: {
              kakaoId: profile.id,
            },
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              userEmail: profile._json && profile._json.kakao_account.email,
              kakaoId: profile.id,
              nickname: profile._json && profile._json.properties.nickname,
              password: "",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
