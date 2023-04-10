import express from 'express';
import pg from './services/pg.js';
import router from './routes/index.js';
import dotenv from 'dotenv';
import AppError from './services/AppErorr.js';
import globalErrorHandler from './controllers/error.controller.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const db = await pg();

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });

    app.use(express.json());
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    app.use('/api/v1', router);

    app.all('*', (req, res, next) => {
      next(new AppError('Page not found', 404));
    });
    app.use(globalErrorHandler);
  } catch (err) {
    console.log(err);
  }
}

start();
