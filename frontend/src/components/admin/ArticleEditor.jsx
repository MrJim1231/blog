import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import styles from '../../styles/ArticleEditor.module.css' // Импортируем CSS-модуль

const ArticleEditor = () => {
  const [title, setTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Начните писать...</p>',
  })

  useEffect(() => {
    fetch('http://localhost/blog/backend/api/get_categories.php')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Ошибка загрузки категорий:', err))
  }, [])

  const formatDateTime = (iso) => {
    const date = new Date(iso)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
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
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const content = editor.getHTML()
    const selected = categories.find((cat) => cat.id.toString() === selectedCategory)
    const category_name = selected ? selected.name : ''

    const article = {
      title,
      content,
      category_id: selectedCategory,
      category_name,
      createdAt: formatDateTime(new Date().toISOString()),
    }

    try {
      const response = await fetch('http://localhost/blog/backend/api/save_article.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })

      const result = await response.json()
      console.log('✅ Ответ сервера:', result)

      if (response.ok) {
        alert(result.message || 'Статья успешно сохранена')
        setTitle('')
        setSelectedCategory('')
        editor.commands.setContent('<p>Начните писать...</p>')
      } else {
        alert(result.message || 'Ошибка при сохранении статьи')
      }
    } catch (error) {
      console.error('❌ Ошибка соединения:', error)
      alert('Ошибка соединения с сервером')
    }
  }

  return (
    <div className={styles.editorContainer}>
      <h2 className={styles.editorTitle}>Создание статьи</h2>

      <input type="text" placeholder="Заголовок статьи" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.inputField} />

      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={styles.selectCategory}>
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

      <button onClick={handleSubmit} className={styles.saveButton}>
        Сохранить статью
      </button>

      <div className={styles.previewSection}>
        <h3 className={styles.previewTitle}>Превью:</h3>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className={styles.previewContent} dangerouslySetInnerHTML={{ __html: editor?.getHTML() }} />
      </div>
    </div>
  )
}

export default ArticleEditor
