import { Link } from 'react-router-dom'
import '../styles/Categories.css'
import { useEffect, useState } from 'react'
import DeleteCategory from './DeleteCategory'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Для редактирования
  const [editingCategory, setEditingCategory] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [editedImage, setEditedImage] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/blog/backend/api/get_categories.php')
        const data = await response.json()

        if (data.length > 0) {
          setCategories(data)
        } else {
          console.error('Нет категорий')
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const handleEditClick = (category) => {
    setEditingCategory(category)
    setEditedName(category.name)
    setEditedImage(category.image)
  }

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('http://localhost/blog/backend/api/edit_category.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingCategory.id,
          name: editedName,
          image: editedImage,
        }),
      })

      const data = await response.json()
      console.log(data)

      // Обновим локальный список
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: editedName, image: editedImage } : cat)))

      setEditingCategory(null)
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <Link to={`/category/${cat.name}`} className="category-button">
            <img src={`http://localhost/blog/backend/${cat.image}`} alt={cat.name} className="category-image" />
            <span>{cat.name}</span>
          </Link>

          <DeleteCategory categoryId={cat.id} onDelete={handleDeleteCategory} />

          {/* Кнопка редактирования */}
          <button onClick={() => handleEditClick(cat)}>Редактировать</button>
        </div>
      ))}

      {editingCategory && (
        <div className="edit-modal">
          <h3>Редактировать категорию</h3>
          <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} placeholder="Название" />
          <input type="text" value={editedImage} onChange={(e) => setEditedImage(e.target.value)} placeholder="URL изображения" />
          <button onClick={handleSaveEdit}>Сохранить</button>
          <button onClick={() => setEditingCategory(null)}>Отмена</button>
        </div>
      )}
    </div>
  )
}

export default Categories
