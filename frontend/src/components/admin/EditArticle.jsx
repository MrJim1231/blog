import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import '../../styles/ArticleEditor.css'

const EditArticle = () => {
  const { id } = useParams() // Получаем ID статьи из URL
  const navigate = useNavigate()

  const [article, setArticle] = useState({
    title: '',
    content: '',
    category_name: '',
    category_id: '',
    images: [],
  })
  const [categories, setCategories] = useState([]) // Для списка категорий
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Инициализация редактора с Tiptap
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: article.content || '<p>Начните писать...</p>', // Инициализация редактора с содержимым статьи
  })

  // Загрузка статьи и категорий
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/get_article.php?id=${id}`)
        const data = await response.json()

        if (data.id) {
          setArticle(data)
          // Устанавливаем контент статьи в редактор после загрузки данных
          editor.commands.setContent(data.content)
        } else {
          setError('Статья не найдена')
        }
      } catch (err) {
        setError('Ошибка загрузки статьи')
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost/blog/backend/api/get_categories.php')
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error('Ошибка загрузки категорий:', err)
      }
    }

    fetchArticle()
    fetchCategories()
  }, [id, editor]) // Повторно инициализировать редактор при изменении данных статьи

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

    const content = editor.getHTML()
    const selectedCategory = categories.find((cat) => cat.id.toString() === article.category_id)

    const updatedArticle = {
      id,
      title: article.title,
      content,
      category_id: article.category_id,
      category_name: selectedCategory ? selectedCategory.name : '',
      images: article.images,
    }

    try {
      const response = await fetch('http://localhost/blog/backend/api/update_article.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      })

      const data = await response.json()
      if (data.message === 'Статья успешно обновлена') {
        navigate(`/article/${id}`) // Перенаправление на страницу статьи после успешного обновления
      } else {
        setError(data.message || 'Ошибка при обновлении статьи')
      }
    } catch (err) {
      setError('Ошибка при обновлении статьи')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imgSrc = reader.result
        editor
          .chain()
          .focus()
          .setImage({
            src: imgSrc,
            alt: 'Uploaded Image',
            style: 'width: 300px; height: 300px;',
          })
          .run()

        // Добавляем изображение в список
        setArticle((prev) => ({
          ...prev,
          images: [...prev.images, imgSrc],
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Редактировать статью</h2>

      {/* Заголовок */}
      <input type="text" placeholder="Заголовок статьи" name="title" value={article.title} onChange={handleChange} className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" />

      {/* Выбор категории */}
      <select name="category_id" value={article.category_id} onChange={handleChange} className="w-full px-4 py-2 mb-4 border border-gray-300 rounded">
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Панель инструментов */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn">
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn">
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">
          • Список
        </button>
        <label htmlFor="image-upload" className="btn cursor-pointer">
          🖼 Вставить изображение
        </label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
      </div>

      {/* Редактор */}
      <div className="border rounded p-4 min-h-[200px] bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Кнопка сохранения */}
      <button onClick={handleSubmit} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded" disabled={isSubmitting}>
        {isSubmitting ? 'Сохраняем...' : 'Сохранить изменения'}
      </button>

      {/* Превью */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Превью:</h3>
        <h2 className="text-2xl font-bold">{article.title}</h2>
        <div className="prose max-w-none bg-gray-100 p-4 rounded shadow mt-2" dangerouslySetInnerHTML={{ __html: editor?.getHTML() }} />
      </div>
    </div>
  )
}

export default EditArticle
