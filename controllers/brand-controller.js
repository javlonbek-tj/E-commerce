export const createBrand = async (req, res, next) => {
  const { name } = req.body;
  const brand = await req.db.product_brand.create({ name });
  res.status(201).json({
    succes: true,
    data: brand,
  });
};
export const getAllBrands = async (req, res, next) => {
  const allBrands = await req.db.product_brand.findAll();
  res.status(200).json({
    succes: true,
    data: allBrands,
  });
};
