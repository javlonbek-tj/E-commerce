import { Op } from 'sequelize';
export default function filtering(productBrandId, productTypeId, from, to) {
  let filtering;

  // if exists all of them
  if (productBrandId && productTypeId && from && to) {
    filtering = {
      productBrandId,
      productTypeId,
      price: {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  }

  // if exist only productBrandId
  if (productBrandId && !productTypeId && !from && !to) {
    filtering = {
      productBrandId,
    };
  }
  // if exists productBrandId and productTypeId
  if (productBrandId && productTypeId && !from && !to) {
    filtering = {
      productBrandId,
      productTypeId,
    };
  }

  // if exist productBrandId, productTypeId and from
  if (productBrandId && productTypeId && from && !to) {
    filtering = {
      productBrandId,
      productTypeId,
      price: {
        [Op.gte]: from,
      },
    };
  }

  // if exists productBrandId, from and to
  if (productBrandId && !productTypeId && from && to) {
    filtering = {
      productBrandId,
      price: {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  }

  // if exists productBrandId and to
  if (productBrandId && !productTypeId && !from && to) {
    filtering = {
      productBrandId,
      price: {
        [Op.lte]: to,
      },
    };
  }

  // if exists productBrandId and from
  if (productBrandId && !productTypeId && from && !to) {
    filtering = {
      productBrandId,
      price: {
        [Op.lte]: to,
      },
    };
  }

  // if exists productTypeId, from and to
  if (!productBrandId && productTypeId && from && to) {
    filtering = {
      productTypeId,
      price: {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  }

  // if exists productTypeId and from
  if (!productBrandId && productTypeId && from && !to) {
    filtering = {
      productTypeId,
      price: {
        [Op.gte]: from,
      },
    };
  }

  // if exists productTypeId and to
  if (!productBrandId && productTypeId && !from && to) {
    filtering = {
      productTypeId,
      price: {
        [Op.lte]: to,
      },
    };
  }

  // if exists from and to
  if (!productBrandId && !productTypeId && from && to) {
    filtering = {
      price: {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  }
  // if exist only productTypeId
  if (!productBrandId && productTypeId && !from && !to) {
    filtering = {
      productTypeId,
    };
  }

  // if exists only from
  if (!productBrandId && !productTypeId && from && !to) {
    filtering = {
      price: {
        [Op.gte]: from,
      },
    };
  }

  // if exists from and to
  if (!productBrandId && !productTypeId && from && to) {
    filtering = {
      price: {
        [Op.and]: { [Op.gte]: from, [Op.lte]: to },
      },
    };
  }

  // if exists only to
  if (!productBrandId && !productTypeId && !from && to) {
    filtering = {
      price: {
        [Op.lte]: to,
      },
    };
  }

  // if not exists any of them
  if (!productBrandId && !productTypeId && !from && !to) {
    filtering = {};
  }
  return filtering;
}
