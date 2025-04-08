import React from 'react'

const NotFound = () => {
  React.useEffect(() => {
    document.title = 'Ошибка 404 - Страница не найдена'
  }, [])

  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>
        Попробуйте вернуться на <a href="/">главную</a>.
      </p>
    </div>
  )
}

export default NotFound
