import AppError from '../services/AppError.js';
import { v4 } from 'uuid';
import path from 'path';
import { validationResult } from 'express-validator';

export const getAdminPage = async (req, res, next) => {
  try {
    res.render('admin/adminPage', {
      pageTitle: 'Admin',
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getProdTypePage = async (req, res, next) => {
  try {
    const types = await req.db.productType.findAll();
    res.render('admin/prodType', {
      pageTitle: `Mahsulot turi qo'shish`,
      errorMessage: null,
      types,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const createType = async (req, res, next) => {
  try {
    const types = await req.db.productType.findAll();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/prodType', {
        pageTitle: `Mahsulot turi qo'shish`,
        errorMessage: errors.array()[0].msg,
        types,
      });
    }
    const { name } = req.body;
    const type = await req.db.productType.findOne({ where: { name: `${name}` } });
    if (type) {
      return res.render('admin/prodType', {
        pageTitle: `Mahsulot turi qo'shish`,
        errorMessage: `${name} oldin qo'shilgan`,
        types,
      });
    }
    await req.db.productType.create({ name });
    res.redirect('/admin/prodType');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const { name } = req.body;
    const brand = await req.db.productBrand.create({ name });
    res.status(201).json({
      succes: true,
      data: brand,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const createProduct = async (req, res, next) => {
  try {
    let { name, price, productBrandId, productTypeId, top, ...info } = req.body;
    const { img } = req.files;
    let fileName = v4() + '.jpg';
    img.mv(path.resolve('images', fileName));
    const product = await req.db.products.create({
      name,
      price,
      productBrandId,
      productTypeId,
      img: fileName,
      top,
    });
    /*  if (info) {
        info = JSON.parse(info);
        info.forEach(i => {
          req.db.productInfos({
            title: i.title,
            description: i.description,
            productId: product.id,
          });
        });
      } */
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
