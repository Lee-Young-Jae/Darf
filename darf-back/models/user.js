const DataTypes = require("sequelize");
const { Model } = DataTypes;

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        userEmail: {
          type: DataTypes.STRING(25),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        kakaoId: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        nickname: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Diary, {
      constraints: false,
    });
    // db.User.hasToMany(db.Board);
    db.User.belongsToMany(db.Group, {
      through: "GroupMember",
    });
    db.User.hasMany(db.GroupPost);
    db.User.hasMany(db.PostComment);
    db.User.hasOne(db.UserProfile);
  }
}

module.exports = User;
