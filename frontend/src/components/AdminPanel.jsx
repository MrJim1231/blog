import { useState, useEffect } from 'react'
import '../styles/AdminPanel.css'

export default function AdminPanel() {
  const [category, setCategory] = useState('') // Название категории
  const [imageFile, setImageFile] = useState(null) // Для хранения выбранного файла
  const [message, setMessage] = useState('') // Для отображения сообщения об ошибке или успехе
  const [categoryImage, setCategoryImage] = useState('') // Для хранения URL изображения после отправки

  const [articleTitle, setArticleTitle] = useState('') // Заголовок статьи
  const [articleContent, setArticleContent] = useState('') // Контент статьи
  const [articleCategory, setArticleCategory] = useState('') // Категория статьи
  const [articleImage, setArticleImage] = useState('') // Изображение статьи
  const [articleFile, setArticleFile] = useState(null) // Файл изображения статьи
  const [categories, setCategories] = useState([]) // Массив категорий из базы данных

  // Получение списка категорий с сервера
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/blog/backend/api/get_categories.php')
        const data = await response.json()
        setCategories(data) // Устанавливаем категории в состояние
      } catch (error) {
        setMessage('Ошибка при загрузке категорий')
      }
    }
    fetchCategories()
  }, [])

  // Обработка выбора изображения для категории
  const handleCategoryImageChange = (e) => {
    setImageFile(e.target.files[0]) // Получаем выбранный файл
    const reader = new FileReader()
    reader.onloadend = () => {
      setCategoryImage(reader.result) // Устанавливаем изображение для предпросмотра
    }
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Обработка выбора изображения для статьи
  const handleArticleImageChange = (e) => {
    setArticleFile(e.target.files[0]) // Получаем выбранный файл изображения для статьи
    const reader = new FileReader()
    reader.onloadend = () => {
      setArticleImage(reader.result) // Устанавливаем изображение для предпросмотра статьи
    }
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Обработка отправки формы категории
  const handleCategorySubmit = async (e) => {
    e.preventDefault()

    if (!category.trim()) {
      setMessage('Категория не может быть пустой')
      return
    }

    const formData = new FormData()
    formData.append('category', category)
    if (imageFile) {
      formData.append('image', imageFile) // Добавляем файл изображения
    }

    try {
      const response = await fetch('http://localhost/blog/backend/api/add_category.php', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setMessage(result.message)
      setCategory('') // очищаем поле
      setImageFile(null) // очищаем выбранный файл
      setCategoryImage('') // очищаем предпросмотр изображения
    } catch (error) {
      setMessage('Ошибка при отправке запроса')
    }
  }

  // Обработка отправки формы статьи
  const handleArticleSubmit = async (e) => {
    e.preventDefault()

    if (!articleTitle.trim() || !articleContent.trim() || !articleCategory.trim()) {
      setMessage('Все поля обязательны')
      return
    }

    const formData = new FormData()
    formData.append('title', articleTitle)
    formData.append('content', articleContent)
    formData.append('category_id', articleCategory) // ID категории

    // Получаем имя категории по id
    const selectedCategory = categories.find((cat) => cat.id === parseInt(articleCategory)) // Получаем выбранную категорию
    if (selectedCategory) {
      formData.append('category_name', selectedCategory.name) // Имя категории
    }

    if (articleFile) {
      formData.append('image', articleFile) // Добавляем файл изображения статьи
    }

    try {
      const response = await fetch('http://localhost/blog/backend/api/add_article.php', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      setMessage(result.message)
      setArticleTitle('') // очищаем поле
      setArticleContent('') // очищаем текст
      setArticleCategory('') // очищаем выбранную категорию
      setArticleFile(null) // очищаем выбранный файл
      setArticleImage('') // очищаем предпросмотр изображения
    } catch (error) {
      setMessage('Ошибка при отправке запроса')
    }
  }

  return (
    <div className="admin-panel">
      {/* Блок добавления категории */}
      <h2>Добавить новую категорию</h2>
      <form onSubmit={handleCategorySubmit}>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Введите название категории" required />
        <input type="file" onChange={handleCategoryImageChange} accept="image/*" />
        <button type="submit">Добавить</button>
      </form>

      {/* Блок добавления статьи */}
      <h2>Добавить новую статью</h2>
      <form onSubmit={handleArticleSubmit}>
        <input type="text" value={articleTitle} onChange={(e) => setArticleTitle(e.target.value)} placeholder="Введите заголовок статьи" required />
        <textarea value={articleContent} onChange={(e) => setArticleContent(e.target.value)} placeholder="Введите содержание статьи" required />
        <select value={articleCategory} onChange={(e) => setArticleCategory(e.target.value)} required>
          <option value="">Выберите категорию</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleArticleImageChange} accept="image/*" />
        <button type="submit">Добавить статью</button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Предпросмотр изображения категории */}
      {categoryImage && (
        <div className="category-preview">
          <h3>Предпросмотр изображения категории</h3>
          <img src={categoryImage} alt="Preview" className="preview-image" />
          <p>{category}</p>
        </div>
      )}

      {/* Предпросмотр изображения статьи */}
      {articleImage && (
        <div className="article-preview">
          <h3>Предпросмотр изображения статьи</h3>
          <img src={articleImage} alt="Preview" className="preview-image" />
          <p>{articleTitle}</p>
        </div>
      )}
    </div>
  )
}
