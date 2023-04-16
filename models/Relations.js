export default async function Relations(db) {
  await db.users.hasOne(db.carts, { onDelete: 'CASCADE' });
  await db.carts.belongsTo(db.users);

  await db.productType.hasMany(db.products);
  await db.products.belongsTo(db.productType);

  await db.products.hasMany(db.productInfo, { onDelete: 'CASCADE' });
  await db.productInfo.belongsTo(db.products);

  await db.productBrand.hasMany(db.products);
  await db.products.belongsTo(db.productBrand);

  await db.products.hasMany(db.images);
  await db.images.belongsTo(db.products);

  await db.products.belongsToMany(db.carts, { through: db.cartItems });
  await db.carts.belongsToMany(db.products, { through: db.cartItems });

  await db.users.hasMany(db.orders);
  await db.orders.belongsTo(db.users);

  await db.products.belongsToMany(db.orders, { through: db.orderItems });
  await db.orders.belongsToMany(db.products, { through: db.orderItems });

  await db.productBrand.belongsToMany(db.productType, {
    through: db.typeBrands,
  });
  await db.productType.belongsToMany(db.productBrand, {
    through: db.typeBrands,
  });
}
