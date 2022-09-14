const DataTypes = require("sequelize");
const { Model } = DataTypes;

class Group extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        emoji: {
          type: DataTypes.STRING(30),
          allowNull: false,
        },
        capacity: {
          type: DataTypes.INTEGER(10).UNSIGNED,
          allowNull: false,
        },
        purpose: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        introduce: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Group",
        tableName: "groups",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Group.belongsTo(db.User, { as: "admin" });
    db.Group.belongsToMany(db.User, {
      through: "GroupMember",
    });
    db.Group.hasMany(db.GroupPost);

    // db.Group.hasMany(db.User, {
    //   as: "Member",
    //   foreignKey: "UserId",
    //   constraints: false,
    // });
    // db.Groups.hasMany(db.Board);
  }
}

module.exports = Group;
