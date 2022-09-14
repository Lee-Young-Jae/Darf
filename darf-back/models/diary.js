const DataTypes = require("sequelize");
const { Model } = DataTypes;

class Diary extends Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        emotion: {
          type: DataTypes.FLOAT(3).UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Diary",
        tableName: "diarys",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Diary.belongsTo(db.User);
  }
}

module.exports = Diary;
