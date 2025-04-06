import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import '../styles/ArticlePage.css'

const ArticlePage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/get_article.php?id=${id}`)
        const data = await response.json()

        if (data.id) {
          setArticle(data)
        } else {
          setError(data.message || 'Статья не найдена')
        }
      } catch (err) {
        setError('Ошибка загрузки статьи')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (loading) return <div>Загрузка статьи...</div>
  if (error) return <div className="error-message">{error}</div>

  // Преобразование контента: замена src и добавление класса к <img>
  const contentWithImages = article?.content
    .replace(/<img[^>]+src="([^"]+)"/g, (match, p1) => {
      const baseUrl = 'http://localhost/blog/backend/'
      return match.replace(p1, baseUrl + p1)
    })
    .replace(/<img(?![^>]*class=)/g, '<img class="article-image"') // Добавляем класс, если его нет

  return (
    <div className="article-page">
      <h1>{article.title}</h1>
      <p className="article-meta">
        Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
      </p>

      <div className="article-full-content" dangerouslySetInnerHTML={{ __html: contentWithImages }}></div>
    </div>
  )
}

export default ArticlePage
