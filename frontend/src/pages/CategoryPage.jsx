import { useParams } from 'react-router-dom' // Используем useParams для получения параметра категории
import { useState } from 'react'

// Данные рецептов (можно вынести в отдельный файл)
const recipes = [
  { id: 1, title: 'ПП Оладьи', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Завтраки' },
  { id: 2, title: 'Кето Пицца', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Ужины' },
  { id: 3, title: 'Смузи с бананом', img: 'https://optim.tildacdn.com/tild3265-3030-4737-b432-346437306538/-/resize/560x/-/format/webp/bdf99666c5f13867e1ce.jpg', category: 'Напитки' },
]

export default function CategoryPage() {
  const { category } = useParams() // Получаем название категории из URL
  const filteredRecipes = recipes.filter((recipe) => recipe.category === category)

  return (
    <div className="container">
      <h1 className="header-title">Категория: {category}</h1>

      <div className="recipe-grid">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.img} alt={recipe.title} />
              <h3 className="recipe-card-title">{recipe.title}</h3>
              <p className="recipe-card-category">{recipe.category}</p>
            </div>
          ))
        ) : (
          <p>Рецепты в этой категории не найдены.</p>
        )}
      </div>
    </div>
  )
}
