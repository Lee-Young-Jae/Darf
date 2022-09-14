const { Sequelize } = require("sequelize");
const DataTypes = require("sequelize");
const { Model } = DataTypes;

class PostComment extends Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: DataTypes.TEXT,
          allowNULL: false,
        },
        isSecret: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "PostComment",
        tableName: "postcomment",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.PostComment.belongsTo(db.User);
    db.PostComment.belongsTo(db.GroupPost);
  }
}

module.exports = PostComment;
