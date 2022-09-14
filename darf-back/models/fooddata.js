const DataTypes = require("sequelize");
const { Model } = DataTypes;

class FoodData extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        kcal: {
          type: DataTypes.FLOAT(30),
          allowNull: false,
        },
        // created_at: {
        //   type: DataTypes.DATE,
        //   allowNull: true,
        //   defaultValue: sequelize.literal("now()"),
        // },
      },
      {
        sequelize,
        modelName: "Fooddata",
        tableName: "fooddata",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
        timestamps: false,
      }
    );
  }

  static associate(db) {}
}

module.exports = FoodData;
