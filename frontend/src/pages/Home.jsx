import React from 'react'
import { motion } from 'framer-motion'
import '../styles/Home.css'

const Home = () => {
  return (
    <main className="blog-container">
      <header className="blog-header">
        <h1 className="blog-title">Мой Блог</h1>
        <p className="blog-subtitle">Добро пожаловать в мой мир мыслей</p>
      </header>

      <section className="blog-posts">
        {[1, 2, 3].map((post) => (
          <motion.div key={post} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: post * 0.1 }}>
            <div className="blog-card">
              <h2 className="post-title">Заголовок поста {post}</h2>
              <p className="post-description">Это краткое описание поста номер {post}. Нажмите, чтобы прочитать подробнее.</p>
              <a href="#" className="read-more">
                Читать дальше
              </a>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  )
}

export default Home
