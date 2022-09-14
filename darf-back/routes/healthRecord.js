const express = require("express");
const {
  Width,
  HealthRecordDiet,
  HealthRecordExercise,
  Image,
} = require("../models");
const { Op } = require("sequelize");
const router = express.Router();
const multer = require("multer");
const path = require("path"); //path node 제공
const fs = require("fs"); //fileSystem node 제공

// localhost:3065/api/healthRecordRouter/load/width GET  || width 불러오기
router.get("/width/load", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const width = await Width.findAll({
    where: { UserId: req.user.id },
    order: [
      ["date", "DESC"],
      ["createdAt", "DESC"],
    ],
  });

  res.status(200).json(width);
});
// localhost:3065/api/healthRecordRouter/width/create POST  || width 추가
router.post("/width/create", async (req, res, next) => {
  try {
    const width = await Width.create({
      width: req.body.width,
      UserId: req.user.id,
      date: req.body.date,
    });
    res.status(200).json(width);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// localhost:3065/api/healthRecordRouter/width/remove/:widthId DELETE  ||width 삭제
router.delete("/width/remove/:WidthId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const width = await Width.findOne({
      where: { id: req.params.WidthId },
    });

    if (!width) {
      return res.status(401).send("체중 기록이 존재하지 않습니다...");
    }

    await width.destroy({
      where: {
        id: width.id,
      },
    });

    res.status(200).json({ id: req.params.WidthId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/load GET  || 식단기록 불러오기
// 0은 식단기록 1은 운동기록
router.get("/load", async (req, res, next) => {
  const type = parseInt(req.query.healthType, 10);
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const healthRecordDiet = await HealthRecordDiet.findAll({
    where: { UserId: req.user.id, type },
    order: [
      ["date", "DESC"],
      ["createdAt", "DESC"],
    ],
    include: [{ model: Image }],
  });

  res.status(200).json(healthRecordDiet);
});

try {
  fs.accessSync("uploads"); //upload 디렉토리가 있는지 검사(없으면 에러)
} catch (error) {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads"); //uplaod 디렉토리 생성
}

//이미지 업로드용 라우터
const upload = multer({
  // 어디에 저장할 것인지
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads");
    },
    filename(req, file, done) {
      //ex Ori.jpg 라는 파일이 있을때
      //파일명 중복 처리 (기본적으로 노드는 파일명이 중복되면 기존파일에 덮어쓴다)
      const ext = path.extname(file.originalname); //확장자 추출(.jpg) //path는 노드에서 제공하는 모듈
      const bassname = path.basename(file.originalname, ext); //Ori라는 확장자를 제외한 파일명 추출
      done(null, bassname + "_" + new Date().getTime() + ext); // Ori202202031552512.jpg
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, //20MB 파일 사이즈 제한
});

// localhost:3065/api/healthRecordRouter/imges POST
//만약에 이미지가 한장이라면 upload.single("image") // 이미지가 아닌 text json 등등이다. upload.none()
router.post("/images", upload.array("image"), (req, res, next) => {
  //POST /post/images
  try {
    console.log(req.files);
    res.json(req.files.map((e) => e.filename));
  } catch (error) {
    console.error();
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/create POST  || 식단 추가
router.post("/create", upload.none(), async (req, res, next) => {
  try {
    const healthRecordDiet = await HealthRecordDiet.create({
      name: req.body.name[0],
      type: req.body.type,
      kcal: req.body.kcal,
      date: req.body.date,
      UserId: req.user.id,
    });

    if (Array.isArray(req.body.image)) {
      //이미지가 여러 개라면? image: [1번.jpg, 2번.jpg]
      const images = await Promise.all(
        req.body.image.map((e) => {
          return Image.create({ src: e });
        })
      );
      await healthRecordDiet.addDietImages(images);
    } else if (req.body.image) {
      // 이미지가 한개라면? image: i번.jpg
      const image = await Image.create({
        src: req.body.image,
      });
      await healthRecordDiet.addDietImages(image);
    }

    const fullHealthRecordDiet = await HealthRecordDiet.findOne({
      where: { id: healthRecordDiet.id },
      include: [{ model: Image }],
    });

    res.status(200).json(fullHealthRecordDiet);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/diet/remove DELETE  || Diet 삭제
router.delete("/diet/remove/:dietId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const diet = await HealthRecordDiet.findOne({
      where: { id: req.params.dietId },
    });

    if (!diet) {
      return res.status(401).send("식단 입력 기록이 존재하지 않습니다...");
    }

    await diet.destroy({
      where: {
        id: diet.id,
      },
    });

    res.status(200).json(req.params.dietId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/exercise/load GET  || 운동기록 불러오기
router.get("/exercise/load", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const healthRecordExercise = await HealthRecordExercise.findAll({
    where: { UserId: req.user.id },
    order: [
      ["date", "DESC"],
      ["createdAt", "DESC"],
    ],
  });

  res.status(200).json(healthRecordExercise);
});
// localhost:3065/api/healthRecordRouter/create POST  || 운동기록 추가
router.post("/exercise/create", async (req, res, next) => {
  try {
    const healthRecordExercise = await HealthRecordExercise.create({
      name: req.body.name,
      minute: req.body.minute,
      date: req.body.date,
      type: req.body.type,
      bodyPart: req.body.bodyPart,
      intensity: req.body.intensity,
      UserId: req.user.id,
    });
    res.status(200).json(healthRecordExercise);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/exercise/remove/:exerciseId DELETE  || 운동기록 삭제
router.delete("/exercise/remove/:exerciseId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const exercise = await HealthRecordExercise.findOne({
      where: { id: parseInt(req.params.exerciseId) },
    });

    if (!exercise) {
      return res.status(401).send("운동 입력 기록이 존재하지 않습니다...");
    }

    await exercise.destroy({
      where: {
        id: exercise.id,
      },
    });

    res.status(200).json(req.params.exerciseId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/healthRecordRouter/chart/:days GET  || 차트에 사용할 데이터 (식단칼로리, 몸무게, 날짜)불러오기
router.get("/chart/:days", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const now = new Date();

    const referenceDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - parseInt(req.params.days)
    );

    const diet = await HealthRecordDiet.findAll({
      where: { UserId: req.user.id, date: { [Op.gte]: referenceDate } },
      order: [
        ["date", "ASC"],
        ["CreatedAt", "ASC"],
      ],
      attributes: {
        exclude: ["name", "type", "createdAt", "updatedAt", "UserId"],
      },
    });

    const width = await Width.findAll({
      where: { UserId: req.user.id, date: { [Op.gte]: referenceDate } },
      order: [
        ["date", "ASC"],
        ["CreatedAt", "ASC"],
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "UserId"],
      },
    });

    //1. 같은 날짜의 식단 데이터 끼리는 칼로리의 합 더하고 하나만 남겨진 배열
    let temp = [];
    let tempIndex = 0;
    let filteredDiet = diet.filter((item, index) => {
      if (!temp.includes(new Date(item.date).getDate())) {
        tempIndex = index;
        temp.push(new Date(item.date).getDate());
        return true;
      }
      diet[tempIndex].kcal += item.kcal;
      return false;
    });

    temp = [];
    //2. 여러개의 체중데이터 중 같은 날 입력된 데이터들은 하나만 남겨진 배열
    let filteredWidth = width.filter((item, index) => {
      if (!temp.includes(new Date(item.date).getDate())) {
        temp.push(new Date(item.date).getDate());
        return true;
      }
      return false;
    });

    temp = [];
    // 식단과 체중의 모든 날짜를 합치고 중복 날짜를 없앤 배열
    let dates = filteredDiet
      .concat(filteredWidth)
      .map((item) => new Date(item.date))
      .filter((item) => {
        if (!temp.includes(item.getDate())) {
          temp.push(item.getDate());
          return true;
        }
        return false;
      })
      .sort((a, b) => a - b);

    temp = [];
    let filteredDates = dates.map((e) => new Date(e).getDate()); // Date중에서 날짜만 모은 배열
    // 모든 날짜 중에서 기록이 없는 날짜가 공백 처리 된 칼로리 배열
    let filteredDietDates = filteredDiet.map((e) => new Date(e.date).getDate()); // 식단중에서 날짜만 모은 배열

    filteredDiet = filteredDates.map((date, index) => {
      if (filteredDietDates.includes(date)) {
        return filteredDiet[filteredDietDates.indexOf(date)];
      }
      return { kcal: 0, date: dates[index] };
    });

    // 모든 날짜 중에서 기록이 없는 날짜가 공백 처리 된 체중 배열

    let filteredWidthDates = filteredWidth.map((e) =>
      new Date(e.date).getDate()
    ); // 체중중에서 날짜만 모은 배열

    filteredWidth = filteredDates.map((date, index) => {
      if (filteredWidthDates.includes(date)) {
        return filteredWidth[filteredWidthDates.indexOf(date)];
      }
      return { width: 0, date: dates[index] };
    });

    res.status(200).json({ diet: filteredDiet, width: filteredWidth, dates });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
