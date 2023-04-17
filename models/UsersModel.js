export default function UsersModel(sequelize, Sequelize) {
  return sequelize.define('user', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
      unique: true,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
    },
    role: {
      type: Sequelize.DataTypes.STRING,
      allowNul: false,
      defaultValue: 'User',
    },
  });
}
