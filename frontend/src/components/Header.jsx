import { Link } from 'react-router-dom' // Импортируем Link для перехода
import '../styles/Header.css' // Стили для Header

const categories = [
  'Подарки',
  'Кино и сериалы',
  'Прогулки и досуг',
  'Путешествия',
  'Кулинария и рецепты',
  'Книги и чтение',
  'Музыка',
  'Финансы и инвестиции',
  'Поставщики и бизнес',
  'Компьютеры и техника',
]

export default function Header() {
  return (
    <header className="header-container">
      <h1 className="header-title">Guide 💡 Life Blog</h1>
      <p className="description">Рецепты здорового питания и вкусных блюд!</p>

      {/* Категории */}
      <div className="categories-container">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/category/${cat}`} // Переход на страницу категории
            className="category-button"
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  )
}
