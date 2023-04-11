export default function CartModel(sequelize, Sequelize) {
  return sequelize.define('cart', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
}
