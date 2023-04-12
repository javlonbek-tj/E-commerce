import AppError from '../services/AppError.js';
import { Op } from 'sequelize';
import filtering from '../services/filtering.js';
import formatProd from '../services/formatProd.js';

export const homePage = async (req, res, next) => {
  try {
    const topProds = await req.db.products.findAll({ where: { top: { [Op.not]: 'false' } }, raw: true });
    const allProds = await req.db.products.findAll({
      where: { top: { [Op.not]: 'true' } },
      order: [['createdAt', 'DESC']],
      raw: true,
    });
    if (topProds.length > 0) {
      formatProd(topProds);
    }
    if (allProds.length > 0) {
      formatProd(allProds);
    }
    res.render('home', {
      pageTitle: 'E-Shopping',
      topProds,
      prods: allProds,
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
      where: { id: id },
      include: req.db.productInfo,
    });
    res.render('prod-detail', {
      pageTitle: `${product.name}`,
      product,
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
