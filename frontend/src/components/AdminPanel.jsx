import { useState } from 'react'
import '../styles/AdminPanel.css'

export default function AdminPanel() {
  const [category, setCategory] = useState('') // Название категории
  const [imageFile, setImageFile] = useState(null) // Для хранения выбранного файла
  const [message, setMessage] = useState('') // Для отображения сообщения об ошибке или успехе
  const [categoryImage, setCategoryImage] = useState('') // Для хранения URL изображения после отправки

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]) // Получаем выбранный файл
    const reader = new FileReader()
    reader.onloadend = () => {
      setCategoryImage(reader.result) // Устанавливаем изображение для предпросмотра
    }
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
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
      // Логирование данных перед отправкой
      console.log('Отправляем данные на сервер:', { category, imageFile })

      const response = await fetch('http://localhost/blog/backend/api/add_category.php', {
        method: 'POST',
        body: formData, // Отправляем данные как FormData
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

  return (
    <div className="admin-panel">
      <h2>Добавить новую категорию</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Введите название категории" required />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*" // Только изображения
        />
        <button type="submit">Добавить</button>
      </form>
      {message && <p className="message">{message}</p>}

      {/* Предпросмотр изображения */}
      {categoryImage && (
        <div className="category-preview">
          <h3>Предпросмотр</h3>
          <img src={categoryImage} alt="Preview" className="preview-image" />
          <p>{category}</p>
        </div>
      )}
    </div>
  )
}
