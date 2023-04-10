export default function TypeBrand(sequelize, Sequelize) {
  return sequelize.define("typeBrand", {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });
}
