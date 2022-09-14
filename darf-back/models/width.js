const DataTypes = require("sequelize");
const { Sequelize } = require("sequelize");

const { Model } = DataTypes;

class Width extends Model {
  static init(sequelize) {
    return super.init(
      {
        width: {
          type: DataTypes.FLOAT(10).UNSIGNED,
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
        modelName: "Width",
        tableName: "width",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Width.belongsTo(db.User);
  }
}

module.exports = Width;
