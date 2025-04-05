// components/EditCategoryModal.jsx
import { useState, useEffect } from 'react'

const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [name, setName] = useState(category.name)
  const [file, setFile] = useState(null)

  useEffect(() => {
    setName(category.name)
    setFile(null)
  }, [category])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('id', category.id)
    formData.append('name', name)
    if (file) {
      formData.append('image', file)
    }

    try {
      const response = await fetch('http://localhost/blog/backend/api/edit_category.php', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      console.log(data)

      onSave({
        ...category,
        name,
        image: data.image || category.image,
      })

      onClose()
    } catch (error) {
      console.error('Ошибка при обновлении категории:', error)
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="edit-modal">
        <h3>Редактировать категорию</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleSubmit}>Сохранить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </>
  )
}

export default EditCategoryModal
