export default function ProductsModel(sequelize, Sequelize) {
  return sequelize.define('product', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNulll: false,
    },
    price: {
      type: Sequelize.DataTypes.DECIMAL(10, 2),
      allowNulll: false,
    },
    top: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: 'false',
    },
  });
}
