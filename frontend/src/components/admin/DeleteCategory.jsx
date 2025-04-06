import React, { useState } from 'react'

const DeleteCategory = ({ categoryId, onDelete }) => {
  const [loading, setLoading] = useState(false) // Для отслеживания состояния загрузки
  const [error, setError] = useState(null) // Для отображения ошибок

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost/blog/backend/api/delete_category.php?id=${categoryId}`, {
          method: 'GET',
        })

        if (response.ok) {
          onDelete(categoryId) // Вызов функции удаления категории из списка
          // Обновляем состояние без вывода alert
        } else {
          setError('Ошибка при удалении категории') // Если ошибка, показываем её
        }
      } catch (error) {
        setError('Ошибка при удалении категории') // Если ошибка при запросе
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Удаление...' : 'Удалить категорию'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default DeleteCategory
