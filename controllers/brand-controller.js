import AppError from '../services/AppError.js';

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
export const getAllBrands = async (req, res, next) => {
  try {
    const allBrands = await req.db.productBrand.findAll();
    res.status(200).json({
      succes: true,
      data: allBrands,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
