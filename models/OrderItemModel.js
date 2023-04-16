export default function OrderItem(sequelize, Sequelize) {
  return sequelize.define('orderItem', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNul: false,
    },
    phone: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    userName: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    province: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    region: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    extraAddress: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    address: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
  });
}
