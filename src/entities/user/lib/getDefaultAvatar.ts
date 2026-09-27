import type { Gender } from '@/shared/config'

export const getDefaultAvatar = (gender: Gender) => {
  const index = Math.floor(Math.random() * 90)
  return `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${index}.jpg`
}
