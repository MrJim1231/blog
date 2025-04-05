// src/components/Categories.jsx
import { Link } from 'react-router-dom' // Для навигации между страницами

const Categories = () => {
  // Массив категорий внутри компонента
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

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <Link
          key={cat}
          to={`/category/${cat}`} // Переход на страницу выбранной категории
          className="category-button"
        >
          {cat}
        </Link>
      ))}
    </div>
  )
}

export default Categories
