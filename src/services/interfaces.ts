export interface PaginationParams {
  limit?: number
  skip?: number
}

export interface PageParams extends PaginationParams {
  q?: string
}

export interface Page<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface Readable<T> {
  getAll(params?: PaginationParams): Promise<T[]>
  getById(id: number): Promise<T>
}

export interface Pageable<T> {
  getPage(params?: PageParams): Promise<Page<T>>
}

export interface Creatable<T, TCreate> {
  create(data: TCreate): Promise<T>
}

export interface Editable<T, TUpdate> {
  update(id: number, data: TUpdate): Promise<T>
}

export interface Deletable {
  delete(id: number): Promise<void>
}
