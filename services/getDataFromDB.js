import capitalizeNames from './toUpperCase.js';

export default async (typeModel, brandModel) => {
  const types = await typeModel.findAll();
  const brands = await brandModel.findAll();
  return {
    types: capitalizeNames(types),
    brands: capitalizeNames(brands),
  };
};
