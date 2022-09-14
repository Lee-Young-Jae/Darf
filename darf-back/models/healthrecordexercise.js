const { Sequelize } = require("sequelize");
const DataTypes = require("sequelize");
const { Model } = DataTypes;

class HealthRecordExercise extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        minute: {
          type: DataTypes.INTEGER(30),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        type: {
          //유산소, 무산소, 스트레칭 (여러개 선택 가능)
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        bodyPart: {
          // 전신 팔 복근 하체 등 어깨 가슴 허리 엉덩이 (여러개 선택 가능)
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        intensity: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "HealthRecordExercise",
        tableName: "healthrecordexercise",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.HealthRecordExercise.belongsTo(db.User);
  }
}

module.exports = HealthRecordExercise;
