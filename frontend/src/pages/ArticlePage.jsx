import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from '../styles/ArticlePage.module.css'

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
  if (error) return <div className={styles.errorMessage}>{error}</div>

  const contentWithImages = article?.content
    .replace(/<img[^>]+src="([^"]+)"/g, (match, p1) => {
      const baseUrl = 'http://localhost/blog/backend/'
      return match.replace(p1, baseUrl + p1)
    })
    .replace(/<img(?![^>]*class=)/g, `<img class="${styles.articleImage}"`)

  return (
    <div className={styles.articlePage}>
      <h1>{article.title}</h1>
      <p className={styles.articleMeta}>
        Категория: {article.category_name} | Дата: {new Date(article.created_at).toLocaleDateString()}
      </p>
      <div className={styles.articleFullContent} dangerouslySetInnerHTML={{ __html: contentWithImages }}></div>
    </div>
  )
}

export default ArticlePage
