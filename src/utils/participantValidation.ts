export interface ParticipantFormValues {
  name: string
  dob: string
  email: string
  phone: string
}

export interface ParticipantFormErrors {
  name: string
  dob: string
  email: string
  phone: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+380\d{9}$/

export function validateParticipantForm(
  values: ParticipantFormValues,
  existingEmails: string[],
): ParticipantFormErrors {
  const errors: ParticipantFormErrors = { name: '', dob: '', email: '', phone: '' }

  errors.name = values.name.trim() ? '' : "Поле обов'язкове для заповнення"

  if (!values.email.trim()) {
    errors.email = "Поле обов'язкове для заповнення"
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Некоректний формат email'
  } else if (existingEmails.includes(values.email.trim().toLowerCase())) {
    errors.email = 'Учасник з такою поштою вже зареєстрований'
  } else {
    errors.email = ''
  }

  if (!values.phone.trim()) {
    errors.phone = "Поле обов'язкове для заповнення"
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = 'Формат телефону: +380XXXXXXXXX'
  } else {
    errors.phone = ''
  }

  if (!values.dob) {
    errors.dob = "Поле обов'язкове для заповнення"
  } else if (new Date(values.dob) > new Date()) {
    errors.dob = 'Дата народження не може бути у майбутньому'
  } else {
    errors.dob = ''
  }

  return errors
}

export function hasErrors(errors: ParticipantFormErrors): boolean {
  return Boolean(errors.name || errors.dob || errors.email || errors.phone)
}
