import type { HttpClient } from '@/api/http-client'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'
import type {
  Creatable,
  Deletable,
  Editable,
  Page,
  Pageable,
  PageParams,
  PaginationParams,
  Readable,
} from './interfaces'

interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const USER_FIELDS = 'firstName,lastName,email,username,password,age,gender,phone,image'

export type UserRepository = Readable<User> &
  Pageable<User> &
  Creatable<User, CreateUserDto> &
  Editable<User, UpdateUserDto> &
  Deletable

// Префікс /auth робить ендпоінти DummyJSON захищеними: без Bearer-токена — 401
export class UserService implements UserRepository {
  private readonly basePath = '/auth/users'
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  async getAll(params: PaginationParams = {}): Promise<User[]> {
    const page = await this.getPage(params)
    return page.items
  }

  async getPage({ q, limit, skip }: PageParams = {}): Promise<Page<User>> {
    const path = q ? `${this.basePath}/search` : this.basePath
    const data = await this.http.get<UsersResponse>(path, {
      auth: true,
      query: { q, limit, skip, select: USER_FIELDS },
    })
    return { items: data.users, total: data.total, skip: data.skip, limit: data.limit }
  }

  getById(id: number): Promise<User> {
    return this.http.get<User>(`${this.basePath}/${id}`, { auth: true })
  }

  create(data: CreateUserDto): Promise<User> {
    return this.http.post<User>(`${this.basePath}/add`, { auth: true, body: data })
  }

  update(id: number, data: UpdateUserDto): Promise<User> {
    return this.http.put<User>(`${this.basePath}/${id}`, { auth: true, body: data })
  }

  async delete(id: number): Promise<void> {
    await this.http.delete<User>(`${this.basePath}/${id}`, { auth: true })
  }
}
