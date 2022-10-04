const express = require("express");
const {
  Group,
  User,
  GroupPost,
  PostComment,
  UserProfile,
} = require("../models");
const { Op } = require("sequelize");
const router = express.Router();

// localhost:3065/api/group/load GET  || 내가 가입한 그룹 불러오기
router.get("/load", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const findGroups = await req.user.getGroups({
    include: [
      {
        model: User,
        attributes: ["id", "userEmail"],
      },
    ],
  });

  if (findGroups) {
    res.status(200).json(findGroups);
  }

  // let groups;
  // if (user) {
  //   groups = await user.getGroups({
  //     // limit: parseInt(req.query.limit),
  //     // attributes: ["nickname", "id"],
  //   });
  //   console.log("WWWWWWW@@@@@@", groups);
  // }
});
// localhost:3065/api/group/create POST  || 그룹 만들기
router.post("/create", async (req, res, next) => {
  try {
    const existedGroup = await Group.findOne({
      where: {
        name: req.body.name,
      },
    });

    if (existedGroup) {
      return res.status(401).send("이미 존재하는 그룹 이름입니다.");
    }

    const group = await Group.create({
      name: req.body.name,
      capacity: req.body.capacity,
      purpose: req.body.purpose,
      emoji: req.body.emoji,
      introduce: req.body.introduce,
      password: req.body.password,
      adminId: req.user.id,
    });
    //가입 성공시
    if (group) {
      await group.addUsers(req.user.id);
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/join POST  || 그룹 가입하기
router.post("/join", async (req, res, next) => {
  try {
    const existedGroup = await req.user.hasGroups(req.body.groupId);

    if (existedGroup) {
      return res.status(401).send("이미 가입한 그룹입니다.");
    }

    const group = await Group.findOne({
      where: {
        id: req.body.groupId,
      },
    });

    //조회 성공 시
    if (group) {
      await group.addUsers(req.user.id);
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/post/:postId DELETE  || 포스트 삭제
router.delete("/post/:postId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const groupPost = await GroupPost.findOne({
      where: { id: req.params.postId },
    });

    if (!groupPost) {
      return res.status(401).send("게시글이 존재하지 않습니다...");
    }

    await GroupPost.destroy({
      where: {
        id: groupPost.id,
      },
    });

    res.status(200).json({ id: req.params.postId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/search GET  || 그룹 검색 시도중
router.get("/search", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("유저 세션이 존재하지 않습니다.");
  }

  const groups = await Group.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${decodeURIComponent(req.query.name)}%` } },
        {
          purpose: { [Op.like]: `%${decodeURIComponent(req.query.purpose)}%` },
        },
      ],
    },
    include: [
      {
        model: User,
        attributes: ["id", "userEmail"],
      },
    ],
    limit: 10,
  });

  const filterMyGroup = groups.filter((e) => {
    let temp = e.Users.map((userItem) => {
      return userItem.id;
    });
    return !temp.includes(req.user.id);
  });

  res.status(200).json(filterMyGroup);
});

// localhost:3065/api/group/edit/:groupId PUT  || 그룹 정보 수정 시도중
router.put("/edit/:groupId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const group = await Group.findOne({
      where: {
        id: req.params.groupId,
        adminId: req.user.id,
      },
    });

    if (!group) {
      return res.status(401).send("그룹 관리자만 수정이 가능합니다.");
    }

    const existedGroup = await Group.findOne({
      where: { name: req.body.name },
    });

    if (group.name !== req.body.name && existedGroup) {
      return res.status(401).send("이미 존재하는 그룹 이름입니다.");
    }

    const patchedGroup = await Group.update(
      {
        name: req.body.name,
        emoji: req.body.emoji,
        capacity: req.body.capacity,
        introduce: req.body.introduce,
        password: req.body.password,
      },
      {
        where: { id: group.id },
      }
    );

    const result = await Group.findOne({
      where: { id: group.id },
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// localhost:3065/api/group/post/create POST  || 그룹 게시글 생성 시도중
router.post("/post/create", async (req, res, next) => {
  try {
    const existedGroup = await Group.findOne({
      where: {
        id: req.body.groupId,
      },
    });

    if (!existedGroup) {
      return res.status(401).send("그룹이 존재하지 않습니다.");
    }

    const groupPost = await GroupPost.create({
      PostType: req.body.posttype,
      minute: req.body?.minute || null,
      name: req.body.name,
      date: req.body.date,
      type: req.body.type,
      bodyPart: req.body?.bodypart || null,
      intensity: req.body?.intensity || null,
      kcal: req.body?.kcal || null,
      image: req.body?.image || null,
      like: 0,
      UserId: req.user.id,
      GroupId: req.body.groupId,
    });

    res.status(200).json(groupPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/selected/load GET  || 선택한 그룹 정보 불러오기
router.get("/selected/load", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const groupId = parseInt(req.query.groupId, 10);

    let findGroups = await Group.findOne({
      where: {
        id: groupId,
      },
      include: [
        // {
        //   model: GroupPost,
        //   include: [
        //     {
        //       model: User,
        //       attributes: ["id", "nickname"],
        //       include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        //     },
        //     {
        //       model: PostComment,
        //       include: [
        //         {
        //           model: User,
        //           attributes: ["id", "nickname"],
        //           include: [
        //             { model: UserProfile, attributes: ["id", "emoji"] },
        //           ],
        //         },
        //       ],
        //       order: [
        //         [{ model: PostComment }, "createdAt", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
        //       ],
        //     },
        //   ],
        // },
        {
          model: User,
          attributes: ["id", "userEmail", "nickname"],
          include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        },
      ],
      // order: [
      //   [{ model: GroupPost }, "date", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
      //   [{ model: GroupPost }, "createdAt", "DESC"],
      // ],
    });
    findGroups.GroupPosts = [];

    if (findGroups) {
      res.status(200).json(findGroups);
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// infiniteScrolling get Post
// localhost:3065/api/group/selected/grouppost/load/:groupId/:pageNumber GET  || 선택한 그룹 정보 불러오기
router.get(
  "/selected/grouppost/load/:groupId/:lastId",
  async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send("유저 세션이 존재하지 않습니다.");
      }

      const where = {};

      if (parseInt(req.params.lastId, 10)) {
        where.id = { [Op.lt]: req.params.lastId };
      }
      where.Groupid = req.params.groupId;

      const groupPosts = await GroupPost.findAll({
        where,
        limit: 5,
        order: [
          ["date", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
          ["createdAt", "DESC"],
        ],
        include: [
          {
            model: User,
            attributes: ["id", "nickname"],
            include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
          },
          {
            model: PostComment,
            include: [
              {
                model: User,
                attributes: ["id", "nickname"],
                include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
              },
            ],
            order: [
              [{ model: PostComment }, "createdAt", "DESC"], // PostComment를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
            ],
          },
        ],
      });

      if (groupPosts.length >= 1) {
        res.status(200).json(groupPosts);
        return;
      }
      res.status(401).json("마지막 그룹 포스트입니다.");
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// localhost:3065/api/group/selected/{groupId}/load:userId GET  || 선택한 그룹에서 선택한 유저의 포스트만 불러오기
router.get("/selected/:groupId/load", async (req, res, next) => {
  //req.params.userId
  //req.params.groupId
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const groupId = parseInt(req.params.groupId, 10);
    const userId = parseInt(req.query.userId, 10);

    const findGroups = await Group.findOne({
      where: {
        id: groupId,
      },
      include: [
        {
          model: GroupPost,
          where: { UserId: userId },

          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
            },
            {
              model: PostComment,
              include: [
                {
                  model: User,
                  attributes: ["id", "nickname"],
                  include: [
                    { model: UserProfile, attributes: ["id", "emoji"] },
                  ],
                },
              ],
              order: [
                [{ model: PostComment }, "createdAt", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "userEmail", "nickname"],
          include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        },
      ],
      order: [
        [{ model: GroupPost }, "date", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
        [{ model: GroupPost }, "createdAt", "DESC"],
      ],
    });

    if (findGroups) {
      res.status(200).json(findGroups);
      return;
    }

    return res.status(401).send("해당 유저가 공유한 게시글이 없네요...");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/selected/:groupId/load/post/:postType GET  || 선택한 그룹에서 운동기록|식단기록|전체 만 불러오기
router.get("/selected/:groupId/load/post/:postType", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    // const PostType = req.params.postType === "all" ;
    let where =
      req.params.postType === "All" ? {} : { PostType: req.params.postType };

    const groupId = parseInt(req.params.groupId, 10);

    const findGroup = await Group.findOne({
      where: {
        id: groupId,
      },
      include: [
        {
          model: GroupPost,
          where,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
            },
            {
              model: PostComment,
              include: [
                {
                  model: User,
                  attributes: ["id", "nickname"],
                  include: [
                    { model: UserProfile, attributes: ["id", "emoji"] },
                  ],
                },
              ],
              order: [
                [{ model: PostComment }, "createdAt", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
              ],
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "userEmail", "nickname"],
          include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        },
      ],
      order: [
        [{ model: GroupPost }, "date", "DESC"], // GroupPost를 생성순서로 내림차순( 늦게 생성된 순서 (즉 최신순))
        [{ model: GroupPost }, "createdAt", "DESC"],
      ],
    });

    if (findGroup) {
      res.status(200).json(findGroup);
      return;
    }

    return res.status(401).send("게시글이 없습니다.");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/like PATCH  || 포스트 좋아요 하기
router.patch("/like", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const like = await GroupPost.update(
      {
        like: req.body.like + 1,
      },
      {
        where: {
          id: req.body.postId,
        },
        attributes: ["id", "like"],
      }
    );

    if (like) {
      res
        .status(200)
        .json({ like: req.body.like + 1, postId: req.body.postId });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/comment/create POST  || 그룹 게시글 코멘트 생성 시도중
router.post("/comment/create", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const postComment = await PostComment.create({
      UserId: req.user.id,
      GroupPostId: req.body.postId,
      content: req.body.comment,
      isSecret: req.body.isSecret,
    });

    const fullComment = await PostComment.findOne({
      where: { id: postComment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
          include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        },
      ],
    });

    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/comment/:commentId/:groupId DELETE  || 그룹 게시글 코멘트 삭제 시도중
router.delete("/comment/:commentId/:postId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 세션이 존재하지 않습니다.");
    }

    const existedComment = await PostComment.findOne({
      where: { id: req.params.commentId },
    });

    if (!existedComment) {
      return res.status(401).send("해당 코멘트가 존재하지 않습니다.");
    }

    await PostComment.destroy({
      where: { id: existedComment.id },
    });

    const post = await GroupPost.findOne({
      where: {
        id: req.params.postId,
      },
    });

    const comments = await PostComment.findAll({
      where: { GroupPostId: post.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
          include: [{ model: UserProfile, attributes: ["id", "emoji"] }],
        },
      ],
    });

    res.status(200).json({
      commentId: req.params.commentId,
      postId: req.params.postId,
      comments,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/leave/:groupId DELETE  || 그룹 탈퇴
router.delete("/leave/:groupId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const group = await Group.findOne({
      where: { id: req.params.groupId },
    });

    if (group.adminId === req.user.id) {
      return res.status(401).send("그룹 양도 후 시도해 주세요.");
    }

    if (!group) {
      return res.status(401).send("그룹이 존재하지 않습니다...");
    }

    const result = await group.removeUsers(req.user.id);

    res.status(200).json({ id: req.params.groupId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/drop/:userId/:groupId DELETE  || 그룹 유저 강퇴기능
router.delete("/drop/:userId/:groupId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const existedUser = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!existedUser) {
      return res.status(401).send("해당 유저가 존재하지 않습니다.");
    }

    const group = await Group.findOne({
      where: { id: req.params.groupId },
    });

    if (!group) {
      return res.status(401).send("그룹이 존재하지 않습니다...");
    }

    if (group.adminId !== req.user.id) {
      return res.status(401).send("그룹 대표만 가능합니다.");
    }

    await group.removeUsers(req.params.userId);
    await GroupPost.destroy({
      where: { UserId: req.params.userId },
    });

    res.status(200).json(req.params.userId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/:groupId DELETE  || 그룹 삭제
router.delete("/:groupId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const group = await Group.findOne({
      where: { id: req.params.groupId },
    });

    if (!group) {
      return res.status(401).send("그룹이 존재하지 않습니다...");
    }

    if (group?.adminId !== req.user.id) {
      return res.status(401).send("그룹 대표만 가능한 작업입니다.");
    }

    const members = await group.getUsers({
      where: {
        [Op.not]: { id: req.user.id },
      },
    });

    if (members?.length >= 1) {
      return res.status(401).send("남은 회원이 있습니다.");
    }

    await Group.destroy({
      where: { id: req.params.groupId },
    });

    res.status(200).json(req.params.groupId);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// localhost:3065/api/group/admin/:groupId/:userId PATCH  || 그룹 매니저 양도
router.patch("/admin/:groupId/:userId", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send("유저 토큰이 존재하지 않습니다...");
    }

    const existedUser = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!existedUser) {
      return res.status(401).send("해당 유저가 존재하지 않습니다.");
    }

    const group = await Group.findOne({
      where: { id: req.params.groupId },
    });

    if (!group) {
      return res.status(401).send("그룹이 존재하지 않습니다...");
    }

    if (group?.adminId !== req.user.id) {
      return res.status(401).send("그룹 대표만 가능한 작업입니다.");
    }

    await Group.update(
      {
        adminId: existedUser.id,
      },
      {
        where: { id: req.params.groupId },
      }
    );

    res.status(200).json(existedUser.id);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
