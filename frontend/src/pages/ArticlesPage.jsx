import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DeleteArticle from '../components/admin/DeleteArticle'
import styles from '../styles/ArticlesPage.module.css'

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

  const removeImagesFromContent = (content) => {
    return content.replace(/<img[^>]*>/g, '')
  }

  const getFirstImageFromContent = (content) => {
    const match = content.match(/<img[^>]+src="([^">]+)"/)
    if (match) {
      return `http://localhost/blog/backend/${match[1]}`
    }
    return null
  }

  if (loading) return <div>Загрузка статей...</div>
  if (error) return <div className={styles.errorMessage}>{error}</div>

  return (
    <div className={styles.articlesContainer}>
      <h2>Статьи</h2>
      {articles.map((article) => (
        <div key={article.id}>
          <Link to={`/article/${article.id}`} className={styles.articleCardLink}>
            <div className={styles.articleCard}>
              {getFirstImageFromContent(article.content) && <img src={getFirstImageFromContent(article.content)} alt={article.title} className={styles.articleImage} />}
              <div className={styles.articleContent}>
                <h3>{article.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: removeImagesFromContent(article.content.slice(0, 150)) }} />
                <p className={styles.articleMeta}>
                  Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>

          <div className={styles.articleActions}>
            <Link to={`/edit-article/${article.id}`} className={styles.editArticleButton}>
              Редактировать
            </Link>

            <DeleteArticle articleId={article.id} onDelete={handleDeleteArticle} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ArticlesPage
