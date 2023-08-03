import AppError from '../services/AppError.js';
import { Op } from 'sequelize';
import filtering from '../services/filtering.js';
import formatProd from '../services/formatProd.js';
import capitalizeNames from '../services/toUpperCase.js';
import getDataFromDB from '../services/getDataFromDB.js';

export const homePage = async (req, res, next) => {
  try {
    const topProds = await req.db.products.findAll({
      where: { top: { [Op.not]: 'false' } },
      order: [['createdAt', 'DESC']],
      include: req.db.images,
    });
    const limit = 15;
    const allProds = await req.db.products.findAll({
      where: { top: { [Op.not]: 'true' } },
      order: [['createdAt', 'DESC']],
      limit,
      include: req.db.images,
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
    const { brands, types } = await getDataFromDB;
    let { page, limit, search, productBrandId, productTypeId, from, to } = req.query;
    page = Math.abs(page) || 1;
    limit = Math.abs(limit) || 20;
    let offset = (page - 1) * limit;

    let where = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    } else if (productBrandId || productTypeId || from || to) {
      from = parseInt(from);
      to = parseInt(to);
      where = filtering(productBrandId, productTypeId, from, to);
    }

    const { rows, count } = await req.db.products.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      include: req.db.images,
      distinct: true,
    });

    const total = parseInt(count);
    const isOverLimit = total > limit;

    res.render('products', {
      pageTitle: 'Barcha mahsulotlar',
      prods: rows,
      isOverLimit,
      types,
      brands,
      currentPage: page,
      hasNextPage: limit * page < total,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(total / limit),
      query: req.query,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await req.db.products.findOne({
      where: { id },
      include: [{ model: req.db.productInfo }, { model: req.db.images }],
    });
    res.render('prod-detail', {
      pageTitle: `${product.name}`,
      product,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
