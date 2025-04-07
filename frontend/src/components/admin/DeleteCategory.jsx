import React, { useState } from 'react'
import styles from '../../styles/DeleteCategory.module.css' // Подключаем CSS-модуль

const DeleteCategory = ({ categoryId, onDelete }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost/blog/backend/api/delete_category.php?id=${categoryId}`, {
          method: 'GET',
        })

        if (response.ok) {
          onDelete(categoryId)
        } else {
          setError('Ошибка при удалении категории')
        }
      } catch (error) {
        setError('Ошибка при удалении категории')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={loading} className={styles.button}>
        {loading ? 'Удаление...' : 'Удалить категорию'}
      </button>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default DeleteCategory
