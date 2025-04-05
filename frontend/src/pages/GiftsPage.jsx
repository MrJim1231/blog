// GiftsPage.jsx
import React, { useState } from 'react'
import '../styles/GiftsPage.css'

const giftIdeas = [
  { id: 1, title: 'Что дарить на день рождения?' },
  { id: 2, title: 'Что дарить на Новый год?' },
  { id: 3, title: 'Что дарить на свадьбу?' },
  { id: 4, title: 'Что дарить на 8 марта?' },
  { id: 5, title: 'Что дарить на 23 февраля?' },
  { id: 6, title: 'Что подарить ребёнку на день рождения?' },
  { id: 7, title: 'Что подарить родителям?' },
  { id: 8, title: 'Что подарить другу?' },
  { id: 9, title: 'Что подарить подруге?' },
  { id: 10, title: 'Что подарить бабушке?' },
  { id: 11, title: 'Что подарить дедушке?' },
  { id: 12, title: 'Что подарить мужу?' },
  { id: 13, title: 'Что подарить жене?' },
  { id: 14, title: 'Что подарить на день учителя?' },
  { id: 15, title: 'Что подарить на день матери?' },
  { id: 16, title: 'Что подарить на выпускной?' },
  { id: 17, title: 'Что подарить начальнику?' },
  { id: 18, title: 'Что подарить коллеге?' },
  { id: 19, title: 'Что подарить на крестины?' },
  { id: 20, title: 'Что подарить на годовщину свадьбы?' },
  { id: 21, title: 'Что подарить на День святого Валентина?' },
  { id: 22, title: 'Что подарить на Пасху?' },
  { id: 23, title: 'Что подарить на новоселье?' },
  { id: 24, title: 'Что подарить на рождение ребёнка?' },
  { id: 25, title: 'Что подарить паре на свадьбу?' },
  { id: 26, title: 'Что подарить подростку?' },
  { id: 27, title: 'Что подарить мужчине, у которого всё есть?' },
  { id: 28, title: 'Что подарить женщине, у которой всё есть?' },
  { id: 29, title: 'Как выбрать подарок, если не знаешь, что дарить?' },
  { id: 30, title: 'Как красиво упаковать подарок?' },
]

const GiftsPage = () => {
  const [selectedGift, setSelectedGift] = useState(null)

  return (
    <div className="gifts-page">
      <h1 className="page-title">Подарки на все случаи жизни</h1>
      <p className="page-description">Здесь собраны лучшие идеи для подарков на любые праздники и события.</p>

      <div className="gift-ideas">
        {giftIdeas.map((gift) => (
          <div key={gift.id} className={`gift-item ${selectedGift === gift.id ? 'selected' : ''}`} onClick={() => setSelectedGift(gift.id === selectedGift ? null : gift.id)}>
            <h2>{gift.title}</h2>
          </div>
        ))}
      </div>

      {selectedGift && (
        <div className="gift-details">
          <h2>Детали подарка: {giftIdeas.find((gift) => gift.id === selectedGift).title}</h2>
          <p>Здесь можно добавить описание, идеи и советы по выбору подарка для выбранной категории.</p>
        </div>
      )}
    </div>
  )
}

export default GiftsPage
