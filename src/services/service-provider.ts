import { httpClient } from '@/api/http-client'
import { AuthService } from './auth.service'
import { UserService, type UserRepository } from './user.service'

// Фабрика сервісів: компоненти та сторі залежать від інтерфейсів, а не від реалізації,
// тому в тестах реалізацію легко підмінити фейковою
export class ServiceProvider {
  private static userService: UserRepository | null = null
  private static authService: AuthService | null = null

  static getUserService(): UserRepository {
    ServiceProvider.userService ??= new UserService(httpClient)
    return ServiceProvider.userService
  }

  static getAuthService(): AuthService {
    ServiceProvider.authService ??= new AuthService(httpClient)
    return ServiceProvider.authService
  }

  static setUserService(service: UserRepository): void {
    ServiceProvider.userService = service
  }
}
