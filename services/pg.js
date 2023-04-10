import { Sequelize } from 'sequelize';
import UsersModel from '../models/UsersModel.js';
import ProductsModel from '../models/ProductsModel.js';
import ProductType from '../models/ProductType.js';
import ProductBrand from '../models/ProductBrand.js';
import CartModel from '../models/CartModel.js';
import CartItemModel from '../models/CartItemModel.js';
import TypeBrand from '../models/TypeBrands.js';
import ProductInfo from '../models/ProductInfo.js';
import Relations from '../models/Relations.js';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

export default async function pg() {
  try {
    await sequelize.authenticate();

    // create database object
    let db = {};
    db.users = await UsersModel(sequelize, Sequelize);
    db.products = await ProductsModel(sequelize, Sequelize);
    db.product_info = await ProductInfo(sequelize, Sequelize);
    db.product_type = await ProductType(sequelize, Sequelize);
    db.product_brand = await ProductBrand(sequelize, Sequelize);
    db.carts = await CartModel(sequelize, Sequelize);
    db.cart_items = await CartItemModel(sequelize, Sequelize);
    db.type_brands = await TypeBrand(sequelize, Sequelize);

    await Relations(db);
    await sequelize.sync({ force: false });
    return db;
  } catch (err) {
    console.log(err);
  }
}
