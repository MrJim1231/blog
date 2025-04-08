import { Link } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import DeleteCategory from '../components/admin/DeleteCategory'
import UpdateCategory from '../components/admin/UpdateCategory'
import styles from '../styles/CategoriesPage.module.css'
import { useAuth } from '../context/AuthContext'

const CategoriesPage = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState(null)
  const [visibleItems, setVisibleItems] = useState([])

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

  // Инициализация IntersectionObserver для отслеживания появления элементов на экране
  const observeItem = (index) => {
    const options = {
      rootMargin: '0px 0px -50px 0px', // Убираем элемент из области наблюдения немного раньше
      threshold: 0.1, // Когда 10% элемента будет видно, он будет анимироваться
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleItems((prev) => [...prev, index]) // Добавляем индекс элемента в массив видимых
          observer.unobserve(entry.target) // Отслеживание элемента прекращается после того как он стал видим
        }
      })
    }, options)

    observer.observe(document.getElementById(`category-${index}`)) // Начинаем наблюдение за элементом
  }

  useEffect(() => {
    categories.forEach((_, index) => observeItem(index)) // Добавляем всех элементов для отслеживания
  }, [categories])

  if (loading) return <div>Загрузка...</div>

  return (
    <div className={styles.categoriesContainer}>
      {categories.map((cat, index) => (
        <motion.div
          id={`category-${index}`}
          key={cat.id}
          className={styles.categoryItem}
          initial={{ opacity: 0, y: 50 }}
          animate={visibleItems.includes(index) ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} // Анимация при попадании в область видимости
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        >
          <Link to={`/category/${cat.id}`} className={styles.categoryButton}>
            <img
              src={`http://localhost/blog/backend/${cat.image}`}
              alt={cat.name}
              className={styles.categoryImage}
              loading="lazy" // Добавление lazy loading для картинок
            />
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
    </div>
  )
}

export default CategoriesPage
