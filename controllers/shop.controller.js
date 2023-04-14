import AppError from '../services/AppError.js';
import formatProd from '../services/formatProd.js';

export const getCart = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const productsWithoutImages = await cart.getProducts();
    const products = await Promise.all(
      productsWithoutImages.map(async product => {
        product.images = await product.getImages();
        return product;
      }),
    );
    res.render('shop/cart', {
      pageTitle: 'Savatdagi mahsulotlar',
      products,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const postCart = async (req, res, next) => {
  try {
    let { prodId } = req.body;
    prodId = parseInt(prodId);
    let newQuantity = 1;
    const userCart = await req.user.getCart();
    const productsWithoutImages = await userCart.getProducts({ where: { id: prodId } });
    const products = await Promise.all(
      productsWithoutImages.map(async product => {
        product.images = await product.getImages();
        return product;
      }),
    );
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await req.db.products.findOne({ where: { id: prodId }, include: req.db.images });
    }
    await userCart.addProduct(product, { through: { quantity: newQuantity } });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const increaseQuantityByOne = async (req, res, next) => {
  try {
    let { quantity, prodId } = req.body;
    prodId = parseInt(prodId);
    const userCart = await req.user.getCart();
    const products = await userCart.getProducts({ where: { id: prodId } });
    const cartItemId = products[0].cartItem.id;
    await req.db.cartItems.update({ quantity: quantity }, { where: { id: cartItemId } });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const decreaseQuantityByOne = async (req, res, next) => {
  try {
    let { quantity, prodId } = req.body;
    prodId = parseInt(prodId);
    const userCart = await req.user.getCart();
    const products = await userCart.getProducts({ where: { id: prodId } });
    const cartItemId = products[0].cartItem.id;
    await req.db.cartItems.update({ quantity: quantity }, { where: { id: cartItemId } });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const deleteCart = async (req, res, next) => {
  try {
    let { cartItemId } = req.body;
    cartItemId = parseInt(cartItemId);
    await req.db.cartItems.destroy({ where: { id: cartItemId } });
    res.status(204).json({
      success: true,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
