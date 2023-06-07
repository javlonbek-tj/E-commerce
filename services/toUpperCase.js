export default function capitalizeNames(items) {
  return items.map(item => {
    item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
    return item;
  });
}
