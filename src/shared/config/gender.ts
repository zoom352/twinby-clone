export type Gender = 'male' | 'female'
export type LookingFor = Gender | 'any'

export const GENDER_LABELS: Record<Gender, string> = {
  male: 'Мужчина',
  female: 'Женщина',
}

export const LOOKING_FOR_LABELS: Record<LookingFor, string> = {
  female: 'Девушек',
  male: 'Парней',
  any: 'Всех',
}
