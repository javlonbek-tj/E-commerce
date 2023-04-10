export default async function Relations(db) {
  await db.users.hasOne(db.carts);
  await db.carts.belongsTo(db.users);

  await db.product_type.hasMany(db.products);
  await db.products.belongsTo(db.product_type);

  await db.products.hasMany(db.product_info);
  await db.product_info.belongsTo(db.products);

  await db.product_brand.hasMany(db.products);
  await db.products.belongsTo(db.product_brand);

  await db.products.belongsToMany(db.carts, { through: db.cart_items });
  await db.carts.belongsToMany(db.products, { through: db.cart_items });

  await db.product_brand.belongsToMany(db.product_type, {
    through: db.type_brands,
  });
  await db.product_type.belongsToMany(db.product_brand, {
    through: db.type_brands,
  });
}
