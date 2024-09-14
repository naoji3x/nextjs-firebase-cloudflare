import { useEffect, useState } from 'react'

const useFooterVisible = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0)
  const [isFooterVisible, setIsFooterVisible] = useState(true)
  useEffect(() => {
    const handleScroll = () => {
      const maxScrollY =
        document.documentElement.scrollHeight - window.innerHeight
      const st = window.scrollY

      if (st > lastScrollTop) {
        setIsFooterVisible(false)
      } else if (st > 0 && st < maxScrollY) {
        setIsFooterVisible(true)
      }
      setLastScrollTop(st <= 0 ? 0 : st)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollTop])
  return { isFooterVisible }
}

export default useFooterVisible
