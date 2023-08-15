export default function OrderItem(sequelize, Sequelize) {
  return sequelize.define('orderItem', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    },
    phone: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    extraAddress: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
  });
}
