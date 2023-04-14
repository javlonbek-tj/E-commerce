export default function formatProd(prods) {
  prods.map(p => {
    p.price = parseFloat(p.price).toLocaleString();
  });
  return prods;
}
