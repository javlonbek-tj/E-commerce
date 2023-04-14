import AppError from '../services/AppError.js';
import { validationResult } from 'express-validator';
import { deleteImageIfError, getImageUrl, deleteImage } from '../services/file.js';

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
        top: '',
        brandId: '',
        typeId: '',
        imageUrl: '',
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
    let { name, price, top, brandId, typeId, ...productInfo } = req.body;
    const errors = validationResult(req);
    const images = req.files;
    const imageUrl = getImageUrl(images);
    let imageError = null;
    if (imageUrl.length <= 0) {
      imageError = true;
    }
    if (!errors.isEmpty() || imageError || !brandId || !typeId) {
      if (imageUrl.length > 0) {
        deleteImageIfError(imageUrl);
      }
      return res.render('admin/addProduct', {
        pageTitle: 'Mahsulot qo`shish',
        validationErrors: errors.array(),
        product: {
          name,
          price,
          top,
          brandId,
          typeId,
          imageUrl,
        },
        hasError: true,
        types,
        brands,
      });
    }
    brandId = parseInt(brandId);
    typeId = parseInt(typeId);
    top = top === 'top' ? true : false;
    const data = [];
    for (let i = 0; i < productInfo.title.length; i++) {
      const title = productInfo.title[i];
      const description = productInfo.description[i];
      data.push({ title, description });
    }
    const product = await req.db.products.create({
      name,
      price,
      productBrandId: brandId,
      productTypeId: typeId,
      img: images.image1[0].path,
      top,
    });
    imageUrl.forEach(img => {
      req.db.images.create({
        imageUrl: img,
        productId: product.id,
      });
    });
    if (productInfo) {
      data.forEach(i => {
        req.db.productInfo.create({
          title: i.title,
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

export const deleteProduct = async (req, res, next) => {
  try {
    const { prodId } = req.body;
    const product = await req.db.products.findOne({ where: { id: prodId }, include: req.db.images });
    await req.db.products.destroy({
      where: { id: prodId },
    });
    const imageUrl = product.images.map(img => {
      return img.imageUrl;
    });
    deleteImage(imageUrl);
    res.redirect('/');
  } catch (err) {
    next(new AppError(err, 500));
  }
};
