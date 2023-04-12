export default function ImageModel(sequelize, Sequelize) {
  return sequelize.define('image', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  });
}
