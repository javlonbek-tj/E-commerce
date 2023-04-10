import AppError from '../services/AppError.js';
import { v4 } from 'uuid';
import path from 'path';
import { Op } from 'sequelize';
import filtering from '../services/filtering.js';

export const createProduct = async (req, res, next) => {
  try {
    let { name, price, productBrandId, productTypeId, ...info } = req.body;
    const { img } = req.files;
    let fileName = v4() + '.jpg';
    img.mv(path.resolve('images', fileName));
    const product = await req.db.products.create({
      name,
      price,
      productBrandId,
      productTypeId,
      img: fileName,
    });
    console.log(Object.values(info));
    if (info) {
      info = JSON.parse(info);
      info.forEach(i => {
        req.db.productInfos({
          title: i.title,
          description: i.description,
          productId: product.id,
        });
      });
    }
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product,
      },
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = Math.abs(page) || 1;
    limit = Math.abs(limit) || 10;
    let offset = (page - 1) * limit;
    let prods;
    if (req.query.search) {
      const { search } = req.query;
      prods = await req.db.products.findAll({ where: { name: { [Op.iLike]: `%${search}%` } } });
    } else if (req.query.productBrandId || req.query.productTypeId || req.query.from || req.query.to) {
      let { productBrandId, productTypeId, from, to } = req.query;
      from = parseInt(from);
      to = parseInt(to);
      prods = await req.db.products.findAll({
        where: filtering(productBrandId, productTypeId, from, to),
        offset,
        limit,
      });
    } else {
      prods = await req.db.products.findAll({ offset, limit });
    }
    res.status(200).json({
      success: true,
      date: {
        prods,
      },
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err, 500));
  }
};

export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await req.db.products.findOne({
      where: { id },
      include: req.db.productInfos,
    });
    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await req.db.products.findOne({
      where: { id },
      include: req.db.productInfos,
    });
    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
