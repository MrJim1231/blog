import React from 'react'
import { Link } from 'react-router-dom' // Импортируем Link из react-router-dom

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

const Header = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <header className="header-container">
      <h1 className="home-title">Советы на все случаи жизни</h1>
      <p className="home-subtitle">Рецепты здорового питания и не только! Советы по всем важным вопросам.</p>
      {/* Категории */}
      <div className="categories-wrapper">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={cat === 'Подарки' ? '/gifts' : '/'} // Если категория "Подарки", то переходим на страницу подарков
            className={`category-btn ${selectedCategory === cat ? 'selected' : ''}`}
          >
            {cat}
          </Link>
        ))}
      </div>
    </header>
  )
}

export default Header
