export default function getIconClass(typeName) {
  switch (typeName) {
    case 'Mebellar':
      return 'fas fa-couch';
    case 'Televizorlar':
      return 'fas fa-tv';
    case 'Konditsionerlar':
      return 'fas fa-tablet';
    case "O'yinchoqlar":
      return 'fas fa-baby-carriage';
    case 'Erkaklar kiyimi':
      return 'fas fa-tshirt';
    case 'Ayollar kiyimi':
      return 'fas fa-person-dress';
    case 'Telefonlar':
      return 'fas fa-headphones';
    case 'Telefon aksessuarlari':
      return 'fas fa-headphones';
    case 'Elektronika':
      return 'fas fa-tools';
    case 'Oshxona jixozlari':
      return 'fas fa-kitchen-set';
    case 'Avtotovarlar':
      return 'fas fa-car-side';
    case 'Sport tovarlari':
      return 'fas fa-basketball-ball';
    case 'Oyoq kiyimlar':
      return 'fas fa-shoe-prints';
    case 'Kompyuterlar':
      return 'fas fa-computer';
    case 'Kitoblar':
      return 'fas fa-book';
    default:
      return 'fas fa-question';
  }
}
