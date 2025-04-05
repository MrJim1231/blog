import { useState } from 'react'
import '../styles/Home.css'

const recipes = [
  { id: 1, title: 'ПП Оладьи', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Кулинария и рецепты' },
  { id: 2, title: 'Кето Пицца', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Ужины' },
  { id: 3, title: 'Смузи с бананом', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Напитки' },
]

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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Подарки') // Начальная категория

  const filteredRecipes = selectedCategory === 'Все' ? recipes : recipes.filter((r) => r.category === selectedCategory)

  return (
    <div className="home-container">
      <h1 className="home-title">Советы на все случаи жизни</h1> {/* Изменённое название блога */}
      <p className="home-subtitle">Рецепты здорового питания и не только! Советы по всем важным вопросам.</p> {/* Изменённый подзаголовок */}
      {/* Категории */}
      <div className="categories-wrapper">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`category-btn ${selectedCategory === cat ? 'selected' : ''}`}>
            {cat}
          </button>
        ))}
      </div>
      {/* Список рецептов */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.img} alt={recipe.title} className="recipe-image" />
            <h3 className="recipe-title">{recipe.title}</h3>
            <p className="recipe-category">{recipe.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
