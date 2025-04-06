import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/CategoryPage.css'

const CategoryPage = () => {
  const { category } = useParams()
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

  // Преобразование контента: замена base64-encoded изображений на реальные пути к изображениям
  const updateContentWithImages = (content) => {
    return content.replace(/<img[^>]+src="([^"]+)"/g, (match, p1) => {
      const baseUrl = 'http://localhost/blog/backend/'
      return match.replace(p1, baseUrl + p1) // Обновляем src с базовым URL
    })
  }

  return (
    <div className="articles-container">
      <h2>Статьи</h2>
      {articles.map((article) => (
        <Link to={`/article/${article.id}`} key={article.id} className="article-card-link">
          <div className="article-card">
            {article.images && article.images.length > 0 && (
              <img
                src={`http://localhost/blog/backend/${article.images[0]}`} // Отображаем первое изображение
                alt={article.title}
                className="article-image"
              />
            )}
            <div className="article-content">
              <h3>{article.title}</h3>
              {/* Отображение контента с HTML-разметкой */}
              <p dangerouslySetInnerHTML={{ __html: updateContentWithImages(article.content.slice(0, 150)) }} />
              <p className="article-meta">
                Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default CategoryPage
