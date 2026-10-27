import { ApiConfig } from '../types';

const CONFIG_KEY = 'cinema_hub_api_config';

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:8080/api',
  useMock: false,
  authToken: localStorage.getItem('cinema_hub_token') || null,
};

export function getApiConfig(): ApiConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        authToken: localStorage.getItem('cinema_hub_token') || parsed.authToken || null,
      };
    }
  } catch (e) {
    console.warn('Failed to parse api config from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveApiConfig(config: Partial<ApiConfig>): ApiConfig {
  const current = getApiConfig();
  const updated = { ...current, ...config };
  
  if (config.authToken !== undefined) {
    if (config.authToken) {
      localStorage.setItem('cinema_hub_token', config.authToken);
    } else {
      localStorage.removeItem('cinema_hub_token');
    }
  }

  localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  return updated;
}

export async function requestApi<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  const config = getApiConfig();

  // If mock mode is explicitly forced or token/network fail
  if (config.useMock) {
    throw new Error('MOCK_MODE_ENABLED');
  }

  const url = `${config.baseUrl.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (config.authToken) {
    headers['Authorization'] = `Bearer ${config.authToken}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText || `HTTP ${response.status} ${response.statusText}` };
      }
      throw new Error(errorJson.message || `Sunucu hatası: ${response.status}`);
    }

    // Return empty for 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    console.warn(`Spring Boot API call to ${url} failed:`, err);
    // Rethrow to allow caller to handle or fallback
    throw err;
  }
}
