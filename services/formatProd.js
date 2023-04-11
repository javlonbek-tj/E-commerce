export default function formatProd(prods) {
  prods.map(p => {
    p.price = parseInt(p.price).toLocaleString();
  });
  return prods;
}
