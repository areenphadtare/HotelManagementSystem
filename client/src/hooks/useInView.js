import { useEffect, useRef, useState } from 'react'

export default function useInView(options = { root: null, rootMargin: '0px', threshold: 0.15 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setInView(true)
      })
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, JSON.stringify(options)])

  return [ref, inView]
}
