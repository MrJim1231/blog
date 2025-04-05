import { useState } from 'react'
import '../styles/Home.css' // Импортируем стили

const recipes = [
  { id: 1, title: 'ПП Оладьи', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Завтраки' },
  { id: 2, title: 'Кето Пицца', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Ужины' },
  { id: 3, title: 'Смузи с бананом', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Напитки' },
]

const categories = ['Все', 'Завтраки', 'Обеды', 'Ужины', 'Напитки']

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Все')

  const filteredRecipes = selectedCategory === 'Все' ? recipes : recipes.filter((r) => r.category === selectedCategory)

  return (
    <div className="container">
      <h1 className="header-title">Guide 💡 Life Blog</h1>
      <p className="description">Рецепты здорового питания и вкусных блюд!</p>

      {/* Категории */}
      <div className="categories-container">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`category-button ${selectedCategory === cat ? 'selected' : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Список рецептов */}
      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.img} alt={recipe.title} />
            <h3 className="recipe-card-title">{recipe.title}</h3>
            <p className="recipe-card-category">{recipe.category}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
