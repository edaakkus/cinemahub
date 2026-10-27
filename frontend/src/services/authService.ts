import { AuthResponse, LoginCredentials, RegisterRequest, User } from '../types';
import { requestApi, saveApiConfig } from './apiClient';
import { INITIAL_USER } from '../data/mockData';

const CURRENT_USER_KEY = 'cinema_hub_current_user';

export function getStoredUser(): User | null {
  try {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  } catch {
    return INITIAL_USER;
  }
}

export function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export const authService = {
  /**
   * POST /api/v1/auth/login
   * Spring Boot Auth Controller endpoint
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await requestApi<any>('/auth/login', 'POST', {
        username: credentials.email,
        email: credentials.email,
        password: credentials.password
      });

      const user: User = response.user || {
        id: 1,
        fullName: response.username || credentials.email.split('@')[0],
        email: credentials.email,
        role: (response.role || 'USER') as any,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const finalResponse: AuthResponse = {
        token: response.token,
        type: response.type || 'Bearer',
        user: user,
      };

      saveApiConfig({ authToken: finalResponse.token });
      setStoredUser(user);
      return finalResponse;
    } catch (error: any) {
      if (error.message === 'MOCK_MODE_ENABLED' || error.name === 'TypeError') {
        // Mock Login logic
        if (!credentials.email || !credentials.password) {
          throw new Error('Lütfen e-posta ve şifre giriniz.');
        }

        const mockUser: User = {
          ...INITIAL_USER,
          email: credentials.email,
          fullName: credentials.email.split('@')[0].toUpperCase(),
        };

        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-spring-boot-' + Date.now(),
          type: 'Bearer',
          user: mockUser,
        };

        saveApiConfig({ authToken: mockResponse.token });
        setStoredUser(mockUser);
        return mockResponse;
      }
      throw error;
    }
  },

  /**
   * POST /api/auth/register
   * Spring Boot Auth Register endpoint
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const username = data.fullName.trim().toLowerCase().replaceAll(/\s+/g, '_');
      const response = await requestApi<any>('/auth/register', 'POST', {
        username: username,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password
      });

      const user: User = response.user || {
        id: Math.floor(Math.random() * 1000) + 1,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: (response.role || 'USER') as any,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const finalResponse: AuthResponse = {
        token: response.token,
        type: response.type || 'Bearer',
        user: user,
      };

      saveApiConfig({ authToken: finalResponse.token });
      setStoredUser(user);
      return finalResponse;
    } catch (error: any) {
      if (error.message === 'MOCK_MODE_ENABLED' || error.name === 'TypeError') {
        if (!data.fullName || !data.email) {
          throw new Error('Lütfen tüm zorunlu alanları doldurun.');
        }

        const newUser: User = {
          id: Math.floor(Math.random() * 10000) + 10,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || '+90 555 000 0000',
          role: 'USER',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.fullName)}`,
          createdAt: new Date().toISOString().split('T')[0],
        };

        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-spring-boot-' + Date.now(),
          type: 'Bearer',
          user: newUser,
        };

        saveApiConfig({ authToken: mockResponse.token });
        setStoredUser(newUser);
        return mockResponse;
      }
      throw error;
    }
  },

  /**
   * GET /api/v1/auth/me
   */
  async getCurrentUser(): Promise<User> {
    try {
      const user = await requestApi<User>('/auth/me', 'GET');
      setStoredUser(user);
      return user;
    } catch (error: any) {
      const local = getStoredUser();
      if (local) return local;
      return INITIAL_USER;
    }
  },

  logout() {
    saveApiConfig({ authToken: null });
    setStoredUser(null);
  }
};
