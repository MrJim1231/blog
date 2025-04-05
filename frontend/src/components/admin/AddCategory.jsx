import { useState } from 'react'

const AddCategory = ({ setMessage }) => {
  const [category, setCategory] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [categoryImage, setCategoryImage] = useState('')

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
    const reader = new FileReader()
    reader.onloadend = () => setCategoryImage(reader.result)
    if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!category.trim()) return setMessage('Категория не может быть пустой')

    const formData = new FormData()
    formData.append('category', category)
    if (imageFile) formData.append('image', imageFile)

    try {
      const res = await fetch('http://localhost/blog/backend/api/add_category.php', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      setMessage(result.message)
      setCategory('')
      setImageFile(null)
      setCategoryImage('')
    } catch {
      setMessage('Ошибка при отправке запроса')
    }
  }

  return (
    <div>
      <h2>Добавить категорию</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Название категории" />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <button type="submit">Добавить</button>
      </form>
      {categoryImage && (
        <div className="preview">
          <h4>Предпросмотр</h4>
          <img src={categoryImage} alt="Категория" className="preview-image" />
          <p>{category}</p>
        </div>
      )}
    </div>
  )
}

export default AddCategory
