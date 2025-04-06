import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

const ArticleEditor = () => {
  const [title, setTitle] = useState('')

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '<p>Начните писать...</p>',
  })

  const handleImageInsert = () => {
    const url = prompt('Введите ссылку на изображение:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const handleSubmit = () => {
    const content = editor.getHTML()
    const article = {
      title,
      content,
      createdAt: new Date().toISOString(),
    }

    console.log('📝 Статья:', article)
    alert('Статья сохранена (в консоли)')
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
        <button onClick={handleImageInsert} className="btn">
          🖼 Вставить изображение
        </button>
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
