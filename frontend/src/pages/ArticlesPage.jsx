import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteArticle from '../components/admin/DeleteArticle'
import '../styles/ArticlesPage.css'

const ArticlesPage = () => {
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

  const handleDeleteArticle = (id) => {
    setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id))
  }

  // Удаляем все <img> теги из HTML
  const removeImagesFromContent = (content) => {
    return content.replace(/<img[^>]*>/g, '')
  }

  // Извлекаем src первой картинки из content и добавляем базовый URL
  const getFirstImageFromContent = (content) => {
    const match = content.match(/<img[^>]+src="([^">]+)"/)
    if (match) {
      const imagePath = match[1]
      // Добавляем базовый URL перед относительным путем изображения
      return `http://localhost/blog/backend/${imagePath}`
    }
    return null
  }

  if (loading) return <div>Загрузка статей...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="articles-container">
      <h2>Статьи</h2>
      {articles.map((article) => (
        <div key={article.id} className="article-card-container">
          <Link to={`/article/${article.id}`} className="article-card-link">
            <div className="article-card">
              {getFirstImageFromContent(article.content) && <img src={getFirstImageFromContent(article.content)} alt={article.title} className="article-image" />}
              <div className="article-content">
                <h3>{article.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: removeImagesFromContent(article.content.slice(0, 150)) }} />
                <p className="article-meta">
                  Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
          <DeleteArticle articleId={article.id} onDelete={handleDeleteArticle} />
        </div>
      ))}
    </div>
  )
}

export default ArticlesPage
