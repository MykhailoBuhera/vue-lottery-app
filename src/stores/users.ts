import { ref } from 'vue'
import { defineStore } from 'pinia'
import { HttpError } from '@/api/http-client'
import type { Page, PageParams } from '@/services/interfaces'
import { ServiceProvider } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) {
    return true
  }
  return [user.firstName, user.lastName, user.email, user.username].some((value) =>
    value.toLowerCase().includes(q),
  )
}

/**
 * DummyJSON лише імітує POST/PUT/DELETE — на сервері нічого не змінюється.
 * Тому стор зберігає локальні зміни і накладає їх на кожну відповідь API.
 */
export const useUsersStore = defineStore('users', () => {
  const userService = ServiceProvider.getUserService()

  const usersById = ref<Record<number, User>>({})
  const createdIds = ref<number[]>([])
  const updatedIds = ref<number[]>([])
  const deletedIds = ref<number[]>([])

  function isLocal(id: number): boolean {
    return createdIds.value.includes(id)
  }

  function remember(user: User): User {
    // локально змінений користувач важливіший за «свіжу» відповідь сервера
    if (!updatedIds.value.includes(user.id) && !isLocal(user.id)) {
      usersById.value[user.id] = user
    }
    return usersById.value[user.id] ?? user
  }

  async function fetchPage({ q = '', skip = 0, limit = 10 }: PageParams): Promise<Page<User>> {
    const created = createdIds.value
      .map((id) => usersById.value[id])
      .filter((user): user is User => Boolean(user) && matchesQuery(user as User, q))

    // створені локально користувачі показуються на початку списку
    const apiSkip = Math.max(0, skip - created.length)
    const localOnPage = created.slice(skip, skip + limit)
    const apiLimit = limit - localOnPage.length

    const page = await userService.getPage({ q, skip: apiSkip, limit: Math.max(apiLimit, 1) })
    const apiItems = page.items
      .filter((user) => !deletedIds.value.includes(user.id))
      .map(remember)
      .slice(0, apiLimit)

    return {
      items: [...localOnPage, ...apiItems],
      total: Math.max(0, page.total + created.length - deletedIds.value.length),
      skip,
      limit,
    }
  }

  async function fetchById(id: number): Promise<User> {
    if (deletedIds.value.includes(id)) {
      throw new HttpError(404, 'Користувача видалено')
    }
    const cached = usersById.value[id]
    if (cached && (isLocal(id) || updatedIds.value.includes(id))) {
      return cached
    }
    return remember(await userService.getById(id))
  }

  async function create(data: CreateUserDto): Promise<User> {
    const created = await userService.create(data)
    // DummyJSON завжди повертає однаковий id (total + 1), тож робимо його унікальним
    const maxId = Math.max(created.id, ...createdIds.value)
    const user: User = { ...data, ...created, id: createdIds.value.length ? maxId + 1 : maxId }
    usersById.value[user.id] = user
    createdIds.value.unshift(user.id)
    return user
  }

  async function update(id: number, data: UpdateUserDto): Promise<User> {
    const current = await fetchById(id)
    // локально створеного користувача на сервері немає — PUT поверне 404
    const response = isLocal(id) ? current : await userService.update(id, data)
    const user: User = { ...current, ...response, ...data, id }
    usersById.value[id] = user
    if (!isLocal(id) && !updatedIds.value.includes(id)) {
      updatedIds.value.push(id)
    }
    return user
  }

  async function remove(id: number): Promise<void> {
    if (isLocal(id)) {
      createdIds.value = createdIds.value.filter((createdId) => createdId !== id)
    } else {
      await userService.delete(id)
      deletedIds.value.push(id)
    }
    delete usersById.value[id]
  }

  return { usersById, fetchPage, fetchById, create, update, remove }
})
