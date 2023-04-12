import AppError from '../services/AppError.js';
import { validationResult } from 'express-validator';
import ProductInfo from '../models/ProductInfo.js';

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
    let types = await req.db.productType.findAll({ raw: true });
    types.map(type => {
      type.name = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      return type;
    });
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
    let types = await req.db.productType.findAll({ raw: true });
    types.map(type => {
      type.name = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      return type;
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/prodType', {
        pageTitle: `Mahsulot turi qo'shish`,
        errorMessage: errors.array()[0].msg,
        types,
      });
    }
    let { name } = req.body;
    name = name.toLowerCase();
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

export const getProdBrandPage = async (req, res, next) => {
  try {
    let brands = await req.db.productBrand.findAll({ raw: true });
    brands.map(brand => {
      brand.name = brand.name.charAt(0).toUpperCase() + brand.name.slice(1);
      return brand;
    });
    res.render('admin/prodBrand', {
      pageTitle: `Mahsulot brandi qo'shish`,
      errorMessage: null,
      brands,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const createBrand = async (req, res, next) => {
  try {
    let brands = await req.db.productBrand.findAll({ raw: true });
    brands.map(brand => {
      brand.name = brand.name.charAt(0).toUpperCase() + brand.name.slice(1);
      return brand;
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/prodBrand', {
        pageTitle: `Mahsulot brandi qo'shish`,
        errorMessage: errors.array()[0].msg,
        brands,
      });
    }
    let { name } = req.body;
    name = name.toLowerCase();
    const brand = await req.db.productBrand.findOne({ where: { name: `${name}` } });
    if (brand) {
      return res.render('admin/prodBrand', {
        pageTitle: `Mahsulot brandi qo'shish`,
        errorMessage: `${name} oldin qo'shilgan`,
        brands,
      });
    }
    await req.db.productBrand.create({ name });
    res.redirect('/admin/prodBrand');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getAddProduct = async (req, res, next) => {
  try {
    let brands = await req.db.productBrand.findAll({ raw: true });
    brands.map(brand => {
      brand.name = brand.name.charAt(0).toUpperCase() + brand.name.slice(1);
      return brand;
    });
    let types = await req.db.productType.findAll({ raw: true });
    types.map(type => {
      type.name = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      return type;
    });
    res.render('admin/addProduct', {
      pageTitle: 'Mahsulot qo`shish',
      validationErrors: [],
      product: {
        name: '',
        price: '',
      },
      hasError: null,
      types,
      brands,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const createProduct = async (req, res, next) => {
  try {
    let { name, price, top, brandId, typeId, ...productInfo } = req.body;
    const images = req.files;
    brandId = parseInt(brandId);
    typeId = parseInt(typeId);
    top = top === 'top' ? true : false;
    const data = [];
    for (let i = 0; i < productInfo.title.length; i++) {
      const name = productInfo.title[i];
      const description = productInfo.description[i];
      const obj = {
        name: name,
        description: description,
      };
      data.push(obj);
    }
    const product = await req.db.products.create({
      name,
      price,
      productBrandId: brandId,
      productTypeId: typeId,
      img: images.image1[0].path,
      top,
    });
    if (productInfo) {
      data.forEach(i => {
        req.db.productInfo.create({
          name: i.name,
          description: i.description,
          productId: product.id,
        });
      });
    }
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};
