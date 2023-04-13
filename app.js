import express from 'express';
import pg from './services/pg.js';
import dotenv from 'dotenv';
import AppError from './services/AppError.js';
import { globalErrorHandler, get404 } from './controllers/error.controller.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import upload from './services/fileUpload.js';
dotenv.config();

// Import routes
import { isAuth } from './controllers/auth-controller.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import shopRoutes from './routes/shop.routes.js';

const app = express();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const db = await pg();

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

    app.set('view engine', 'ejs');
    app.set('views', 'views');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use('/images', express.static(path.resolve('images')));
    app.use(express.static(path.resolve('public')));

    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use(isAuth);

    // Set global user
    app.use(function (req, res, next) {
      res.locals.user = req.user || null;
      next();
    });

    app.use(upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]));

    app.use(productRoutes);
    app.use('/admin', adminRoutes);
    app.use(authRoutes);
    app.use(shopRoutes);

    app.use(get404);
    app.use(globalErrorHandler);
  } catch (err) {
    console.log(err);
  }
}

start();
