export default function ProductsModel(sequelize, Sequelize) {
  return sequelize.define('product', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    price: {
      type: Sequelize.DataTypes.DECIMAL,
      allowNul: false,
    },
    img: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    top: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: 'false',
    },
  });
}
