const { Sequelize } = require("sequelize");
const DataTypes = require("sequelize");
const { Model } = DataTypes;

class HealthRecordDiet extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        kcal: {
          type: DataTypes.FLOAT(3).UNSIGNED,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        modelName: "HealthRecordDiet",
        tableName: "healthrecorddiet",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.HealthRecordDiet.belongsTo(db.User);
    db.HealthRecordDiet.hasMany(db.Image); // post.addImages, post.getImages
  }
}

module.exports = HealthRecordDiet;
