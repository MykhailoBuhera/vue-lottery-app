export type Gender = 'male' | 'female'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: Gender
  phone: string
  image?: string
}

export interface CreateUserDto {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: Gender
  phone: string
}

export type UpdateUserDto = Partial<CreateUserDto>
