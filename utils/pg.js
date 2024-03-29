import { Sequelize } from 'sequelize';
import UsersModel from '../models/UsersModel.js';
import ProductsModel from '../models/ProductsModel.js';
import ProductType from '../models/ProductType.js';
import ProductBrand from '../models/ProductBrand.js';
import CartModel from '../models/CartModel.js';
import CartItemModel from '../models/CartItemModel.js';
import TypeBrand from '../models/TypeBrands.js';
import ProductInfo from '../models/ProductInfo.js';
import ImageModel from '../models/ImageModel.js';
import Relations from '../models/Relations.js';
import dotenv from 'dotenv';
import OrderModel from '../models/OrderModel.js';
import OrderItemModel from '../models/OrderItemModel.js';
import logger from './logger.js';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  logging: false,
});

export default async function pg() {
  try {
    await sequelize.authenticate();

    console.log('Database connection has been established successfully.');

    // create database object
    let db = {};
    db.users = await UsersModel(sequelize, Sequelize);
    db.products = await ProductsModel(sequelize, Sequelize);
    db.productInfo = await ProductInfo(sequelize, Sequelize);
    db.productTypes = await ProductType(sequelize, Sequelize);
    db.productBrands = await ProductBrand(sequelize, Sequelize);
    db.carts = await CartModel(sequelize, Sequelize);
    db.cartItems = await CartItemModel(sequelize, Sequelize);
    db.orders = await OrderModel(sequelize, Sequelize);
    db.orderItems = await OrderItemModel(sequelize, Sequelize);
    db.typeBrands = await TypeBrand(sequelize, Sequelize);
    db.images = await ImageModel(sequelize, Sequelize);

    await Relations(db);
    // CAUTION!!!! Only run this in delelopment mode.
    // await sequelize.sync({ force: false });
    return db;
  } catch (err) {
    logger.error('Error in connention to the database', err);
  }
}
