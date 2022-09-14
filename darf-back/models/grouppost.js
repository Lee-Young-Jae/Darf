const { Sequelize } = require("sequelize");
const DataTypes = require("sequelize");
const { Model } = DataTypes;

class GroupPost extends Model {
  static init(sequelize) {
    return super.init(
      {
        PostType: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },
        minute: {
          type: DataTypes.INTEGER(30),
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        type: {
          // ["유산소", "무산소" ....] "아침" "점심" "저녁" ...
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        bodyPart: {
          // ["전신", "팔", "복근", "하체", "등", "어깨", "가슴", "허리", "엉덩이"] (여러개 선택 가능)
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        intensity: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        kcal: {
          type: DataTypes.FLOAT(3).UNSIGNED,
          allowNull: true,
        },
        image: {
          type: DataTypes.STRING(300),
          allowNull: true,
        },
        like: {
          type: DataTypes.INTEGER(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "GroupPost",
        tableName: "grouppost",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.GroupPost.belongsTo(db.User);
    db.GroupPost.belongsTo(db.Group);
    db.GroupPost.hasMany(db.PostComment);

    // db.Groups.hasMany(db.BoardComment);
  }
}

module.exports = GroupPost;
