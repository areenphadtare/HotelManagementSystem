import React from 'react'
import useInView from '../hooks/useInView'
import './Gallery.css'

const images = [
  'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501117716987-c8e5e6a58b0a?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=1600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600&q=80&auto=format&fit=crop',
]

export default function Gallery() {
  const [ref, inView] = useInView()
  return (
    <section id="gallery" className={`gallery ${inView ? 'in-view' : ''}`} ref={ref}>
      <h3>Gallery</h3>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <div className="gallery-item" key={i} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>
    </section>
  )
}
