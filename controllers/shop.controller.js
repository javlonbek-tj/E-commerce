import AppError from '../services/AppError.js';
import { validationResult } from 'express-validator';

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
    const totalProdPrice = products.reduce((accumulator, product) => {
      return accumulator + +product.price;
    }, 0);
    res.render('shop/cart', {
      pageTitle: 'Savatdagi mahsulotlar',
      products,
      totalProdPrice,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const postCart = async (req, res, next) => {
  try {
    const { prodId } = req.body;
    let newQuantity = 1;
    const userCart = await req.user.getCart();
    const cartProducts = await userCart.getProducts();
    const products = await userCart.getProducts({ where: { id: parseInt(prodId) } });
    let product;
    let hasProduct;
    if (products.length > 0) {
      product = products[0];
      hasProduct = true;
    }
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    } else {
      product = await req.db.products.findOne({ where: { id: parseInt(prodId) }, include: req.db.images });
    }
    await userCart.addProduct(product, { through: { quantity: newQuantity } });
    res.status(200).json({
      success: true,
      data: {
        cartProducts,
        hasProduct,
      },
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const increaseQuantityByOne = async (req, res, next) => {
  try {
    const { quantity, prodId } = req.body;
    const userCart = await req.user.getCart();
    const products = await userCart.getProducts({ where: { id: parseInt(prodId) } });
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
    const { quantity, prodId } = req.body;
    const userCart = await req.user.getCart();
    const products = await userCart.getProducts({ where: { id: parseInt(prodId) } });
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
    const { cartItemId } = req.body;
    await req.db.cartItems.destroy({ where: { id: parseInt(cartItemId) } });
    res.status(204).json({
      success: true,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getCheckout = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const productsWithoutImages = await cart.getProducts();
    const products = await Promise.all(
      productsWithoutImages.map(async product => {
        product.images = await product.getImages();
        return product;
      }),
    );
    const total = products.reduce((accumulator, product) => {
      return accumulator + +product.price * product.cartItem.quantity;
    }, 0);
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      products,
      total,
      validationErrors: [],
      order: {
        phone: '',
        name: '',
        province: '',
        region: '',
        extraAddress: '',
        address: '',
      },
      error: false,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const postOrder = async (req, res, next) => {
  try {
    const { phone, name, province, region, extraAddress, address } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const cart = await req.user.getCart();
      const productsWithoutImages = await cart.getProducts();
      const products = await Promise.all(
        productsWithoutImages.map(async product => {
          product.images = await product.getImages();
          return product;
        }),
      );
      const total = products.reduce((accumulator, product) => {
        return accumulator + +product.price * product.cartItem.quantity;
      }, 0);
      return res.render('shop/checkout', {
        pageTitle: 'Checkout',
        products,
        total,
        validationErrors: errors.array(),
        order: {
          phone,
          name,
          province,
          region,
          extraAddress,
          address,
        },
        error: true,
      });
    }
    const cart = await req.user.getCart();
    const products = await cart.getProducts();
    const userOrder = await req.user.createOrder();
    await userOrder.addProducts(
      products.map(product => {
        product.orderItem = {
          quantity: product.cartItem.quantity,
          phone,
          userName: name,
          province,
          region,
          extraAddress,
          address,
        };
        return product;
      }),
    );
    await cart.setProducts(null);
    res.redirect('/orders');
  } catch (err) {
    next(new AppError(err, 500));
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await req.user.getOrders({ include: ['products'] });
    const updatedOrders = await Promise.all(
      orders.map(async order => {
        // Fetch 'products' array for each order
        const products = order.products;

        if (products.length === 0) {
          // If the order's products array is empty, delete the entire order
          await order.destroy({ where: { id: order.id } });
        }
        // Fetch images for each product in 'products' array
        const productsWithImages = await Promise.all(
          products.map(async product => {
            product.images = await product.getImages();
            return product;
          }),
        );

        order.products = productsWithImages;
        return order;
      }),
    );
    res.render('shop/orders', {
      pageTitle: 'Buyurtmalar',
      updatedOrders,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
