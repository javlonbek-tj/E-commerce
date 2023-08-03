export default async function Relations(db) {
  await db.users.hasOne(db.carts, { onDelete: 'CASCADE' });
  await db.carts.belongsTo(db.users);

  await db.productTypes.hasMany(db.products);
  await db.products.belongsTo(db.productTypes);

  await db.products.hasMany(db.productInfo);
  await db.productInfo.belongsTo(db.products);

  await db.productBrands.hasMany(db.products);
  await db.products.belongsTo(db.productBrands);

  await db.products.hasMany(db.images);
  await db.images.belongsTo(db.products);

  await db.products.belongsToMany(db.carts, { through: db.cartItems });
  await db.carts.belongsToMany(db.products, { through: db.cartItems });

  await db.users.hasMany(db.orders);
  await db.orders.belongsTo(db.users);

  await db.products.belongsToMany(db.orders, { through: db.orderItems });
  await db.orders.belongsToMany(db.products, { through: db.orderItems });

  await db.productBrands.belongsToMany(db.productTypes, {
    through: db.typeBrands,
  });
  await db.productTypes.belongsToMany(db.productBrands, {
    through: db.typeBrands,
  });
}
