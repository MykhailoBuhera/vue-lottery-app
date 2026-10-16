import { number, object, string } from 'yup'

const REQUIRED = "Поле обов'язкове для заповнення"
export const PASSWORD_MIN_LENGTH = 6

const password = string()
  .trim()
  .required(REQUIRED)
  .min(PASSWORD_MIN_LENGTH, `Пароль має містити щонайменше ${PASSWORD_MIN_LENGTH} символів`)

export const loginSchema = object({
  username: string().trim().required(REQUIRED),
  password,
})

export const userSchema = object({
  firstName: string().trim().required(REQUIRED).max(50, 'Не більше 50 символів'),
  lastName: string().trim().required(REQUIRED).max(50, 'Не більше 50 символів'),
  email: string().trim().required(REQUIRED).email('Некоректний формат email'),
  username: string()
    .trim()
    .required(REQUIRED)
    .min(3, 'Щонайменше 3 символи')
    .matches(/^[a-zA-Z0-9_.]+$/, 'Лише латинські літери, цифри, «_» та «.»'),
  password,
  age: number()
    .transform((value: number, original: unknown) => (original === '' ? undefined : value))
    .typeError('Вік має бути числом')
    .required(REQUIRED)
    .integer('Вік має бути цілим числом')
    .min(1, 'Вік має бути не менше 1')
    .max(120, 'Вік має бути не більше 120'),
  gender: string().required(REQUIRED).oneOf(['male', 'female'], 'Оберіть стать'),
  phone: string()
    .trim()
    .required(REQUIRED)
    .matches(/^\+?[\d\s()-]{7,20}$/, 'Некоректний номер телефону'),
})
