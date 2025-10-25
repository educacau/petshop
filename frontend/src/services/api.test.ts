import {describe, expect, beforeAll, afterAll, it, vi} from 'vitest';

import api from './api';
import {storage} from '../utils/storage';

vi.mock('../utils/storage', () => {
  return {
    storage: {
      getToken: vi.fn(),
      clearToken: vi.fn(),
      clearUser: vi.fn()
    }
  };
});

const mockedStorage = storage as unknown as {
  getToken: ReturnType<typeof vi.fn>;
  clearToken: ReturnType<typeof vi.fn>;
  clearUser: ReturnType<typeof vi.fn>;
};

const getRequestInterceptor = () => {
  const handler = (api.interceptors.request as unknown as {handlers: Array<{fulfilled?: any}>})
    .handlers[0]?.fulfilled;
  if (!handler) {
    throw new Error('Request interceptor not registered');
  }
  return handler;
};

const getResponseInterceptor = () => {
  const handler = (api.interceptors.response as unknown as {handlers: Array<{rejected?: any}>})
    .handlers[0]?.rejected;
  if (!handler) {
    throw new Error('Response interceptor not registered');
  }
  return handler;
};

describe('api service interceptors', () => {
  let originalLocation: Location;

  beforeAll(() => {
    originalLocation = window.location;

    let currentHref = '/dashboard';
    let currentPathname = '/dashboard';

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        get href() {
          return currentHref;
        },
        set href(value: string) {
          currentHref = value;
          currentPathname = value;
        },
        get pathname() {
          return currentPathname;
        },
        set pathname(value: string) {
          currentPathname = value;
        }
      }
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation
    });
  });

  it('attaches Authorization header when token exists', async () => {
    const interceptor = getRequestInterceptor();
    mockedStorage.getToken.mockReturnValue('token-123');

    const config = await interceptor({headers: {}} as Record<string, unknown>);

    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('clears storage and redirects to login when response status is 401', async () => {
    const interceptor = getResponseInterceptor();
    mockedStorage.clearToken.mockClear();
    mockedStorage.clearUser.mockClear();

    await expect(
      interceptor({
        response: {status: 401}
      })
    ).rejects.toBeDefined();

    expect(mockedStorage.clearToken).toHaveBeenCalled();
    expect(mockedStorage.clearUser).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });
});
