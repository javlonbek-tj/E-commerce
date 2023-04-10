import AppError from '../services/AppError.js';
import { v4 } from 'uuid';
import path from 'path';
import { Op } from 'sequelize';

export const createProduct = async (req, res, next) => {
  try {
    let { name, price, productBrandId, productTypeId, info } = req.body;
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
    let prods;
    if (req.query.search) {
      const { search } = req.query;
      prods = await req.db.products({ where: { [Op.ilike]: '%search%' } });
      return prods;
    }
    if (
      req.query.productBrandId ||
      req.query.productTypeId ||
      req.query.from ||
      req.query.to ||
      req.query.address
    ) {
      let { productBrandId, productTypeId, from, to } = req.query;
      from = parseInt(from);
      to = parseInt(to);
    }
    let { productBrandId, productTypeId, limit, page } = req.query;
  } catch (err) {
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
