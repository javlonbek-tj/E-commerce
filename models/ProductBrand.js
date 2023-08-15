export default function ProductBrand(sequelize, Sequelize) {
  return sequelize.define('productBrand', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  });
}
