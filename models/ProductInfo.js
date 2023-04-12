export default function ProductInfo(sequelize, Sequelize) {
  return sequelize.define('productInfo', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    description: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
  });
}
