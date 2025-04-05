import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/CategoryPage.css'

const CategoryPage = () => {
  const { category } = useParams() // category = ID категории
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/get_articles.php?category=${category}`)
        const data = await response.json()

        if (Array.isArray(data)) {
          setArticles(data)
        } else {
          setError(data.message || 'Неизвестная ошибка')
        }
      } catch (err) {
        setError('Ошибка загрузки статей')
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [category])

  if (loading) return <div>Загрузка статей...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="articles-container">
      <h2>Статьи</h2>
      {articles.map((article) => (
        <div key={article.id} className="article-card">
          <img src={`http://localhost/blog/backend/${article.image}`} alt={article.title} className="article-image" />
          <div className="article-content">
            <h3>{article.title}</h3>
            <p>{article.content.slice(0, 150)}...</p>
            <p className="article-meta">
              Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CategoryPage
