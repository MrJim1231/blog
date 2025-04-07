import { useState, useEffect } from 'react'
import styles from '../../styles/EditCategoryModal.module.css'

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
      const response = await fetch('http://localhost/blog/backend/api/update_category.php', {
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
      <div className={styles.modalOverlay} onClick={onClose} />
      <div className={styles.editModal}>
        <h3>Редактировать категорию</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" className={styles.input} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} className={styles.input} />
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit} className={styles.saveButton}>
            Сохранить
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
        </div>
      </div>
    </>
  )
}

export default EditCategoryModal
