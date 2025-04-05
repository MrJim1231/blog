import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Сопоставление категорий с их ID
const categoryNamesToIds = {
  'Кино и сериалы': 15,
  Завтраки: 1,
  Ужины: 2,
  // Добавьте другие категории и их ID
}

export default function CategoryPage() {
  const { category } = useParams() // Получаем название категории из URL
  const [articles, setArticles] = useState([])
  const [message, setMessage] = useState('')

  // Преобразуем название категории в ID
  const categoryId = categoryNamesToIds[category]

  useEffect(() => {
    if (categoryId) {
      const fetchArticles = async () => {
        try {
          const response = await fetch(`http://localhost/blog/backend/api/get_articles.php?category=${categoryId}`)
          const data = await response.json()

          if (data.message) {
            setMessage(data.message)
          } else {
            setArticles(data)
          }
        } catch (error) {
          setMessage('Ошибка при загрузке статей')
        }
      }

      fetchArticles()
    } else {
      setMessage('Категория не найдена')
    }
  }, [categoryId]) // Перезапускаем запрос, если категория изменится

  return (
    <div className="container">
      <h1 className="header-title">Категория: {category}</h1>

      {message && <p>{message}</p>}

      <div className="recipe-grid">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article.id} className="recipe-card">
              <img src={`http://localhost/blog/${article.image}`} alt={article.title} />
              <h3 className="recipe-card-title">{article.title}</h3>
              <p className="recipe-card-category">{article.category_name}</p>
              <p>{article.content}</p>
            </div>
          ))
        ) : (
          <p>Статьи в этой категории не найдены.</p>
        )}
      </div>
    </div>
  )
}
