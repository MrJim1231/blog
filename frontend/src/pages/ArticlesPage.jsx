import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
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

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/delete_article.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })

        const data = await response.json()

        if (data.message === 'Статья удалена') {
          setArticles(articles.filter((article) => article.id !== id)) // Удаляем статью из состояния
          alert('Статья успешно удалена')
        } else {
          setError(data.message || 'Неизвестная ошибка при удалении статьи')
        }
      } catch (err) {
        setError('Ошибка при удалении статьи')
      }
    }
  }

  if (loading) return <div>Загрузка статей...</div>
  if (error) return <div className="error-message">{error}</div>

  // Преобразование контента: удаляем теги <img> из контента
  const removeImagesFromContent = (content) => {
    return content.replace(/<img[^>]*>/g, '') // Удаляем все теги <img>
  }

  return (
    <div className="articles-container">
      <h2>Статьи</h2>
      {articles.map((article) => (
        <div key={article.id} className="article-card-container">
          <Link to={`/article/${article.id}`} className="article-card-link">
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
                {/* Отображаем контент, но без картинок */}
                <p dangerouslySetInnerHTML={{ __html: removeImagesFromContent(article.content.slice(0, 150)) }} />
                <p className="article-meta">
                  Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
          {/* Добавляем кнопку для удаления статьи */}
          <button onClick={() => handleDeleteArticle(article.id)} className="delete-article-btn">
            Удалить статью
          </button>
        </div>
      ))}
    </div>
  )
}

export default ArticlesPage
