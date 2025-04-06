import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditArticle = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState({
    title: '',
    content: '',
    category_name: '',
    category_id: '',
    images: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/get_article.php?id=${id}`)
        const data = await response.json()

        if (data.id) {
          setArticle(data)
        } else {
          setError('Статья не найдена')
        }
      } catch (err) {
        setError('Ошибка загрузки статьи')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setArticle((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost/blog/backend/api/update_article.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: article.title,
          content: article.content,
          category_id: article.category_id,
          category_name: article.category_name,
          images: article.images, // Здесь можно дополнительно добавить логику для обработки новых изображений
        }),
      })

      const data = await response.json()
      if (data.message === 'Статья успешно обновлена') {
        navigate(`/article/${id}`) // Перенаправляем на страницу статьи после успешного редактирования
      } else {
        setError(data.message || 'Ошибка при обновлении статьи')
      }
    } catch (err) {
      setError('Ошибка при обновлении статьи')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="edit-article-container">
      <h2>Редактировать статью</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Заголовок</label>
          <input type="text" id="title" name="title" value={article.title} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="content">Контент</label>
          <textarea id="content" name="content" value={article.content} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="category_name">Название категории</label>
          <input type="text" id="category_name" name="category_name" value={article.category_name} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="category_id">ID категории</label>
          <input type="text" id="category_id" name="category_id" value={article.category_id} onChange={handleChange} required />
        </div>

        <div>
          <label>Изображения</label>
          {/* Вы можете добавить сюда логику для обработки изображений */}
          <ul>
            {article.images.map((image, index) => (
              <li key={index}>
                <img src={`http://localhost/blog/backend/${image}`} alt={`Изображение ${index + 1}`} width="100" />
              </li>
            ))}
          </ul>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}

export default EditArticle
