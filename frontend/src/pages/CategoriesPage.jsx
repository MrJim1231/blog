import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DeleteCategory from '../components/admin/DeleteCategory'
import UpdateCategory from '../components/admin/UpdateCategory'
import styles from '../styles/CategoriesPage.module.css'
import { useAuth } from '../context/AuthContext'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState(null)

  const { user } = useAuth()

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
    <motion.div className={styles.categoriesContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {categories.map((cat, index) => (
        <motion.div key={cat.id} className={styles.categoryItem} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
          <Link to={`/category/${cat.id}`} className={styles.categoryButton}>
            <img src={`http://localhost/blog/backend/${cat.image}`} alt={cat.name} className={styles.categoryImage} />
            <div>{cat.name}</div>
          </Link>

          {user?.role === 'admin' && (
            <div className={styles.categoryActions}>
              <button className={styles.editCategoryButton} onClick={() => handleEditClick(cat)}>
                Редактировать
              </button>
              <DeleteCategory categoryId={cat.id} onDelete={handleDeleteCategory} />
            </div>
          )}
        </motion.div>
      ))}

      {editingCategory && <UpdateCategory category={editingCategory} onClose={() => setEditingCategory(null)} onSave={handleSaveEdit} />}
    </motion.div>
  )
}

export default CategoriesPage
