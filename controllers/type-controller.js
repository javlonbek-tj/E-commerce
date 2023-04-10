import AppError from '../services/AppError.js';

export const createType = async (req, res, next) => {
  try {
    const { name } = req.body;
    const type = await req.db.productType.create({ name });
    res.status(201).json({
      succes: true,
      data: type,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
export const getAllTypes = async (req, res, next) => {
  try {
    const allTypes = await req.db.productType.findAll();
    res.status(200).json({
      succes: true,
      data: allTypes,
    });
  } catch (err) {
    next(new AppError(err, 500));
  }
};
