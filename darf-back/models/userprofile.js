const DataTypes = require("sequelize");
const { Model } = DataTypes;

class UserProfile extends Model {
  static init(sequelize) {
    return super.init(
      {
        emoji: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "UserProfile",
        tableName: "userProfile",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.UserProfile.belongsTo(db.User);
  }
}

module.exports = UserProfile;
