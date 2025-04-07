import { useState } from 'react'
import styles from '../../styles/DeleteArticle.module.css'

const DeleteArticle = ({ articleId, onDelete }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту статью?')) {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('http://localhost/blog/backend/api/delete_article.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: articleId }),
        })

        if (response.ok) {
          onDelete(articleId)
        } else {
          const data = await response.json()
          setError(data.message || 'Неизвестная ошибка при удалении статьи')
        }
      } catch (err) {
        setError('Ошибка при удалении статьи')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={loading} className={styles.deleteButton}>
        {loading ? 'Удаление...' : 'Удалить статью'}
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default DeleteArticle
