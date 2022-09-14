const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const {
  User,
  GroupPost,
  HealthRecordDiet,
  HealthRecordExercise,
  UserProfile,
} = require("../models");
const { Op } = require("sequelize");

const router = express.Router();

// localhost:3065/api/user GET
router.get("/", (req, res) => {
  res.status(201).send("응답!");
});

// localhost:3065/api/user/load GET
router.get("/load", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: {
          id: req.user.id,
        },
        attribute: {
          exclude: ["password"],
        },
        include: [
          {
            model: UserProfile,
            attributes: ["id", "emoji"],
          },
        ],
      });
      return res.status(200).json(user);
    }
    res.status(200).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/kakao", passport.authenticate("kakao"));

router.get("/callback/kakao", (req, res, next) => {
  passport.authenticate("kakao", (serr, user, cerr) => {
    if (serr) {
      console.error(serr);
      res.redirect("http://localhost:3000/login");
      return;
    }
    if (cerr) {
      res.redirect("http://localhost:3000/login");
      return;
    }

    // passport 로그인 과정입니다. (/passport/index 의 serializeUser 실행됨)
    return req.login(user, async (loginErr) => {
      try {
        if (loginErr) {
          console.error(loginErr);
          return next(loginErr);
        }

        // return res.status(201);
        // .json({ email: user.userEmail, password: "비밀이지롱" });
        // return res.redirect(`http://localhost:3065/api/kakao/success`);
        res.redirect(`http://localhost:3000/kakaologin`);
      } catch (error) {
        return next(error);
      }
    });
  })(req, res, next);
});

router.get("/kakaologin", async (req, res, next) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: UserProfile,
        attributes: ["id", "emoji"],
      },
    ],
  });

  res.status(200).json(user);
});

// localhost:3065/api/user/login POST  || 로그인
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", (serverErr, user, clientErr) => {
    if (serverErr) {
      console.error(serverErr);
      return next(serverErr);
    }

    if (clientErr) {
      return res.status(401).send(clientErr.reason);
    }

    req.login(user, async (loginerr) => {
      if (loginerr) {
        console.error(loginerr);
        return next(loginerr);
      }

      const userInfoWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: UserProfile,
            attributes: ["id", "emoji"],
          },
        ],
      });

      res.status(201).json(userInfoWithoutPassword);
    });
  })(req, res, next);
});

// localhost:3065/api/user/signUp POST  || 회원가입
router.post("/signup", async (req, res, next) => {
  try {
    const existedEmail = await User.findOne({
      where: {
        userEmail: req.body.email,
      },
    });

    if (existedEmail) {
      return res.status(401).send("이미 존재하는 이메일 입니다.");
    }

    const existNickname = await User.findOne({
      where: {
        nickname: req.body.nickname,
      },
    });

    if (existNickname) {
      return res.status(401).send("이미 존재하는 닉네임 입니다.");
    }

    const bcryptPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      userEmail: req.body.email,
      password: bcryptPassword,
      nickname: req.body.nickname,
    });

    // const userInfoWithoutPassword = await User.findOne({
    //   where: { id: user.id },
    //   attributes: { exclude: ["password"] },
    // });
    res.status(201).json("가입성공!");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/user/logout DELETE  || 로그아웃
router.post("/logout", (req, res, next) => {
  try {
    req.logout();
    req.session.destroy();
    res.status(201).send("로그아웃 성공!");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/user/challenge get  || 도전과제 불러오기

router.get("/challenge/:ischangednickname", async (req, res, next) => {
  try {
    let achieveChallengeList = [
      { id: 1, title: "Beginner", icon: "🌱", content: "처음 로그인 했다!" },
    ];

    const challenge2 = await GroupPost.findAll({
      where: { UserId: req.user.id },
    });

    if (challenge2?.length >= 3) {
      achieveChallengeList.push({
        id: 2,
        title: "혼자는 외로워",
        icon: "📡",
        content: `"기록을 3회 공유했다."`,
      });
    }

    const challenge3 = await HealthRecordDiet.findAll({
      where: { UserId: req.user.id, type: "아침" },
    });

    if (challenge3?.length >= 3) {
      achieveChallengeList.push({
        id: 3,
        title: "한국인은 밥심",
        icon: "🍳",
        content: `"아침 태그의 식사를 3번 기록했다."`,
      });
    }

    const challenge4 = await HealthRecordExercise.findAll({
      where: { UserId: req.user.id },
    });

    if (challenge4?.length >= 3) {
      achieveChallengeList.push({
        id: 4,
        title: "멈춰 있질 못하는 타입",
        icon: "🏃‍♂️",
        content: `"운동을 3번 기록했다."`,
      });
    }

    const challenge5 = await HealthRecordDiet.findOne({
      where: {
        UserId: req.user.id,
        kcal: { [Op.gt]: 1000 }, // kcal > 30;
      },
    });

    if (challenge5) {
      achieveChallengeList.push({
        id: 5,
        title: "푸트파이터",
        icon: "🍖",
        content: `"고칼로리 음식을 먹었다."`,
      });
    }

    const callenge6 = parseInt(req.params.ischangednickname);

    if (callenge6) {
      achieveChallengeList.push({
        id: 6,
        title: "변신은 무죄",
        icon: "🐵",
        content: `"닉네임을 1회 변경했다."`,
      });
    }

    const challenge7 = await GroupPost.findOne({
      where: {
        UserId: req.user.id,
        like: { [Op.gt]: 100 }, // kcal > 30;
      },
    });

    if (challenge7) {
      achieveChallengeList.push({
        id: 7,
        title: "인플루언서",
        icon: "🤳",
        content: `"박수를 100번 넘게 받았다."`,
      });
    }

    if (achieveChallengeList?.length >= 8) {
      achieveChallengeList.push({
        id: 5,
        title: "포켓몬마스터",
        icon: "🐱‍🏍",
        content: `"뱃지를 8개를 모았다."`,
      });
    }

    achieveChallengeList.push({
      id: 9,
      title: "",
      icon: "❔",
      content: "숨겨진 도전과제를 완료하고 뱃지를 획득하세요.",
    });

    res.status(201).send(achieveChallengeList);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/user/nickname PATCH  ||  유저 닉네임 변경
router.patch("/nickname", async (req, res, next) => {
  try {
    if (req.body.newNickname.length <= 0) {
      return res.status(401).send("부적절한 닉네임입니다.");
    }

    const me = await User.findOne({
      where: { id: req.user.id },
    });
    if (me.nickname === req.body.newNickname) {
      return res.status(401).send("동일한 닉네임입니다.");
    }

    const existedNickname = await User.findOne({
      where: {
        nickname: req.body.newNickname,
      },
    });

    if (existedNickname) {
      return res.status(401).send("해당 닉네임이 이미 존재합니다.");
    }
    const user = await User.update(
      { nickname: req.body.newNickname },
      { where: { id: req.user.id } }
    );

    res.status(201).send(req.body.newNickname);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/user/profile PATCH  ||  유저 프로필 이모지 변경
router.patch("/profile", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const userProfile = await UserProfile.findOne({
      where: { UserId: req.user.id },
    });

    if (!userProfile) {
      await UserProfile.create({
        emoji: req.body.emoji,
        UserId: req.user.id,
      });
    } else {
      await UserProfile.update(
        { emoji: req.body.emoji },
        {
          where: { UserId: req.user.id },
        }
      );
    }

    res.status(201).send(req.body.emoji);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
