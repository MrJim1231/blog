import { Link } from 'react-router-dom'
import '../styles/Categories.css'
import { useEffect, useState } from 'react'
import DeleteCategory from '../components/admin/DeleteCategory'
import EditCategoryModal from '../components/admin/EditCategoryModal'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState(null)

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
  }

  const handleSaveEdit = (updatedCategory) => {
    setCategories(categories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
  }

  if (loading) return <div>Загрузка...</div>

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <Link to={`/category/${cat.id}`} className="category-button">
            <img src={`http://localhost/blog/backend/${cat.image}`} alt={cat.name} className="category-image" />
            <span>{cat.name}</span>
          </Link>

          <div className="category-actions">
            <button className="edit-category-button" onClick={() => handleEditClick(cat)}>
              Редактировать
            </button>
            <DeleteCategory categoryId={cat.id} onDelete={handleDeleteCategory} />
          </div>
        </div>
      ))}

      {editingCategory && <EditCategoryModal category={editingCategory} onClose={() => setEditingCategory(null)} onSave={handleSaveEdit} />}
    </div>
  )
}

export default Categories
