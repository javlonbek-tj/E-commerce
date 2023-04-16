export default function OrderModel(sequelize, Sequelize) {
  return sequelize.define('order', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
}
