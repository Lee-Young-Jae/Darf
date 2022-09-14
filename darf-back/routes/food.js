const express = require("express");
const { FoodData } = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

// localhost:3065/api/food/load/ GET  ||
router.get("/load/:searchName", async (req, res, next) => {
  console.log(req.params.searchName);

  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const getFoodData = await FoodData.findAll({
    where: {
      name: { [Op.like]: `%${decodeURIComponent(req.params.searchName)}%` },
    },
    // order: [["createdAt", "DESC"]],
  });
  res.status(200).json(getFoodData);
});

module.exports = router;
