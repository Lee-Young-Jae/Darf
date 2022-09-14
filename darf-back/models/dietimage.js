const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class DietImage extends Model {
  static init(sequelize) {
    return super.init(
      {
        src: {
          //이미지 경로
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: "DietImage",
        tableName: "dietimages",
        charset: "utf8",
        collate: "utf8_general_ci",
        sequelize,
      }
    );
  }
  static associate(db) {
    db.Image.belongsTo(db.GroupPost);
  }
};

// module.exports = (sequelize, DataTypes) => {
//   const Image = sequelize.define(
//     "Image",
//     {
//       src: {
//         type: DataTypes.STRING(200), //이미지 경로
//         allowNull: false,
//       },
//     },
//     {
//       charset: "utf8",
//       collate: "utf8_general_ci", //한글 저장
//     }
//   );
//   Image.associate = (db) => {
//     db.Image.belongsTo(db.Post);
//   };
//   return Image;
// };
