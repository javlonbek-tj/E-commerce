export const createType = async (req, res, next) => {
  const { name } = req.body;
  const type = await req.db.product_type.create({ name });
  res.status(201).json({
    succes: true,
    data: type,
  });
};
export const getAllTypes = async (req, res, next) => {
  const allTypes = await req.db.product_type.findAll();
  res.status(200).json({
    succes: true,
    data: allTypes,
  });
};
