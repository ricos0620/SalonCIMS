interface CacheOptions {
  key: string
  ttl?: number // Time to live in milliseconds
}

export function useCache<T>(options: CacheOptions) {
  const { key, ttl = 300000 } = options // デフォルト5分

  const getFromCache = (): T | null => {
    try {
      const cachedData = localStorage.getItem(key)
      const cacheTime = localStorage.getItem(`${key}_time`)

      if (cachedData && cacheTime) {
        const isExpired = Date.now() - Number.parseInt(cacheTime) > ttl
        if (!isExpired) {
          return JSON.parse(cachedData)
        }
      }
    } catch (error) {
      console.error("キャッシュ読み込みエラー:", error)
    }
    return null
  }

  const setToCache = (data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem(`${key}_time`, Date.now().toString())
    } catch (error) {
      console.error("キャッシュ保存エラー:", error)
    }
  }

  const clearCache = () => {
    localStorage.removeItem(key)
    localStorage.removeItem(`${key}_time`)
  }

  return {
    getFromCache,
    setToCache,
    clearCache,
  }
}

