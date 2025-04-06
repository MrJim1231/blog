import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import '../styles/ArticleEditor.css'

const ArticleEditor = () => {
  const [title, setTitle] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Начните писать...</p>',
  })

  // Преобразование ISO-формата в формат MySQL
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

  // Загрузка изображения
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

  // Отправка статьи на сервер
  const handleSubmit = async () => {
    const content = editor.getHTML()
    const article = {
      title,
      content,
      createdAt: formatDateTime(new Date().toISOString()),
    }

    console.log('📦 Отправляем статью:', article)

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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Создание статьи</h2>

      {/* Заголовок */}
      <input type="text" placeholder="Заголовок статьи" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 mb-4 border border-gray-300 rounded" />

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
      <button onClick={handleSubmit} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
        Сохранить статью
      </button>

      {/* Превью */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-2">Превью:</h3>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="prose max-w-none bg-gray-100 p-4 rounded shadow mt-2" dangerouslySetInnerHTML={{ __html: editor?.getHTML() }} />
      </div>
    </div>
  )
}

export default ArticleEditor
