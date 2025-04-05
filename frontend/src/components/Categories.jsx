import { Link } from 'react-router-dom' // Для навигации между страницами
import '../styles/Categories.css' // Импортируем стили для категорий
import { useEffect, useState } from 'react' // Импортируем хук для работы с состоянием
import DeleteCategory from './DeleteCategory' // Импортируем компоненту удаления категории

const Categories = () => {
  const [categories, setCategories] = useState([]) // Состояние для хранения категорий
  const [loading, setLoading] = useState(true) // Состояние для отслеживания загрузки данных

  useEffect(() => {
    // Функция для получения категорий с сервера
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/blog/backend/api/get_categories.php') // Замените на правильный путь
        const data = await response.json()

        if (data.length > 0) {
          setCategories(data) // Сохраняем полный список категорий с изображениями
        } else {
          console.error('Нет категорий')
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories() // Запускаем запрос
  }, [])

  const handleDeleteCategory = (id) => {
    // Функция для удаления категории из локального состояния
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  if (loading) {
    return <div>Загрузка...</div> // Пока данные загружаются
  }

  return (
    <div className="categories-container">
      {categories.map((cat) => (
        <div key={cat.id} className="category-item">
          <Link to={`/category/${cat.name}`} className="category-button">
            <img src={`http://localhost/blog/backend/${cat.image}`} alt={cat.name} className="category-image" />
            <span>{cat.name}</span>
          </Link>

          {/* Кнопка для удаления категории */}
          <DeleteCategory categoryId={cat.id} onDelete={handleDeleteCategory} />
        </div>
      ))}
    </div>
  )
}

export default Categories
