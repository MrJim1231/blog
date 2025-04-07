import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import styles from '../../styles/UpdateArticle.module.css' // Импортируем CSS-модуль

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
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: article.content || '<p>Начните писать...</p>',
  })

  const updateImagePaths = (content) => {
    const updatedContent = content.replace(/src="uploads\//g, 'src="http://localhost/blog/backend/uploads/')
    return updatedContent
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost/blog/backend/api/get_article.php?id=${id}`)
        const data = await response.json()

        if (data.id) {
          setArticle(data)
          const updatedContent = updateImagePaths(data.content)
          editor.commands.setContent(updatedContent)
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
  }, [id, editor])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'category_id') {
      const selectedCategory = categories.find((cat) => cat.id.toString() === value)
      setArticle((prev) => ({
        ...prev,
        category_id: value,
        category_name: selectedCategory ? selectedCategory.name : '',
      }))
    } else {
      setArticle((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateFields = () => {
    if (!article.title) return 'Заголовок статьи обязателен'
    if (!article.content) return 'Контент статьи обязателен'
    if (!article.category_id) return 'Категория обязательна'
    if (!article.category_name) return 'Имя категории обязательно'
    if (!id) return 'ID статьи обязательно'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const validationError = validateFields()
    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    const content = editor.getHTML()
    const relativeContent = content.replace(/src="http:\/\/localhost\/blog\/backend\/uploads\//g, 'src="uploads/')

    const updatedArticle = {
      id,
      title: article.title,
      content: relativeContent,
      category_id: article.category_id,
      category_name: article.category_name,
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
        navigate(`/article/${id}`)
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
            style: 'width: 300px; height: 300px;', // Устанавливаем размеры 300x300
          })
          .run()

        setArticle((prev) => ({
          ...prev,
          images: [...prev.images, imgSrc],
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div className={styles.errorMessage}>{error}</div>

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.editorTitle}>Редактировать статью</h2>

      <input type="text" placeholder="Заголовок статьи" name="title" value={article.title} onChange={handleChange} className={styles.inputField} />

      <select name="category_id" value={article.category_id} onChange={handleChange} className={styles.selectField}>
        <option value="">Выберите категорию</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className={styles.buttonGroup}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={styles.button}>
          B
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={styles.button}>
          I
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={styles.button}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={styles.button}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={styles.button}>
          • Список
        </button>
        <label htmlFor="image-upload" className={styles.button}>
          🖼 Вставить изображение
        </label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className={styles.hiddenInput} />
      </div>

      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>

      <button onClick={handleSubmit} className={styles.saveButton} disabled={isSubmitting}>
        {isSubmitting ? 'Сохраняем...' : 'Сохранить изменения'}
      </button>

      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>Превью:</h3>
        <h2 className="text-2xl font-bold">{article.title}</h2>
        <div className="prose max-w-none bg-gray-100 p-4 rounded shadow mt-2" dangerouslySetInnerHTML={{ __html: editor?.getHTML() }} />
      </div>
    </div>
  )
}

export default EditArticle
