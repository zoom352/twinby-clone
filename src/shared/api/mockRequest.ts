/**
 * Эмуляция сетевого запроса. Вместо реального бэкенда проект
 * использует моки — заменить на fetch/RTK Query можно в слое api.
 */
export const mockRequest = <T>(data: T, ms = 600): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), ms)
  })
