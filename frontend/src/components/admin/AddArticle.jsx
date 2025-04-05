import { useState, useEffect } from 'react'

const AddArticle = ({ setMessage }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('http://localhost/blog/backend/api/get_categories.php')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setMessage('Ошибка при загрузке категорий'))
  }, [setMessage])

  const handleImageChange = (e) => {
    setFile(e.target.files[0])
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !categoryId) {
      setMessage('Все поля обязательны')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category_id', categoryId)

    const selectedCategory = categories.find((cat) => cat.id === parseInt(categoryId))
    if (selectedCategory) formData.append('category_name', selectedCategory.name)
    if (file) formData.append('image', file)

    try {
      const res = await fetch('http://localhost/blog/backend/api/add_article.php', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      setMessage(result.message)
      setTitle('')
      setContent('')
      setCategoryId('')
      setFile(null)
      setImagePreview('')
    } catch {
      setMessage('Ошибка при отправке запроса')
    }
  }

  return (
    <div>
      <h2>Добавить статью</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок статьи" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Содержание статьи" />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Добавить</button>
      </form>
      {imagePreview && (
        <div className="preview">
          <h4>Предпросмотр изображения</h4>
          <img src={imagePreview} alt="Статья" className="preview-image" />
          <p>{title}</p>
        </div>
      )}
    </div>
  )
}

export default AddArticle
