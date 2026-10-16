import type { HttpClient } from '@/api/http-client'
import type { AuthTokens, AuthUser, LoginDto, LoginResponse } from '@/types/auth'

const TOKEN_TTL_MINUTES = 30

export class AuthService {
  private readonly http: HttpClient

  constructor(http: HttpClient) {
    this.http = http
  }

  login(credentials: LoginDto): Promise<LoginResponse> {
    return this.http.post<LoginResponse>('/auth/login', {
      body: { ...credentials, expiresInMins: TOKEN_TTL_MINUTES },
    })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return this.http.post<AuthTokens>('/auth/refresh', {
      body: { refreshToken, expiresInMins: TOKEN_TTL_MINUTES },
    })
  }

  getCurrentUser(): Promise<AuthUser> {
    return this.http.get<AuthUser>('/auth/me', { auth: true })
  }
}
