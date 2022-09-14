const express = require("express");
const { Diary } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

// localhost:3065/api/diary/load GET  || 다이어리 불러오기
router.get("/load", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const diary = await Diary.findAll({
    where: { UserId: req.user.id },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(diary);
});
// localhost:3065/api/diary/create POST  || 다이어리 추가
router.post("/create", async (req, res, next) => {
  try {
    const diary = await Diary.create({
      title: req.body.title,
      content: req.body.content,
      emotion: req.body.emotion,
      UserId: req.user.id,
    });
    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/diary/remove/:diaryId DELETE  ||다이어리 삭제
router.delete("/remove/:diaryId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const diary = await Diary.findOne({
      where: { id: req.params.diaryId },
    });

    if (!diary) {
      return res.status(401).send("일기가 존재하지 않습니다...");
    }

    await Diary.destroy({
      where: {
        id: diary.id,
      },
    });

    res.status(200).json(req.params.diaryId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// localhost:3065/api/diary/update/:diaryId POST||다이어리 업데이트
router.post("/update/:diaryId", async (req, res, next) => {
  try {
    await Diary.update(
      {
        title: req.body.title,
        content: req.body.content,
        emotion: req.body.emotion,
      },
      { where: { id: parseInt(req.params.diaryId), UserId: req.user.id } }
    );

    const diary = await Diary.findOne({
      id: parseInt(req.params.diaryId),
    });

    res.status(200).json(diary);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
