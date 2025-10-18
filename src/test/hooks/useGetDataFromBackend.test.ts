import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useGetDataFromBackend } from '../../core/hooks/useGetDataFromBackend';

// Mock dependencies
jest.mock('axios');
jest.mock('../../core/contexts/auth-context', () => ({
  useAuth: () => ({
    role: 'user',
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    setRole: jest.fn(),
    isLogged: false,
    isAdmin: false,
    isSupervisor: false,
    isUser: true,
  }),
}));

jest.mock('../../core/components/ui/toaster', () => ({
  toaster: {
    create: jest.fn(),
  },
}));

// Importar el toaster mock después de configurarlo
import { toaster } from '../../core/components/ui/toaster';

const mockedAxios = axios as jest.MockedFunction<typeof axios>;
const mockToasterCreate = toaster.create as jest.MockedFunction<
  typeof toaster.create
>;

interface TestData {
  id: number;
  name: string;
  email: string;
}

describe('useGetDataFromBackend', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockToasterCreate.mockClear();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
        })
      );

      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.callback).toBe('function');
    });

    it('should start loading when executeAutomatically is true', () => {
      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
          executeAutomatically: true,
        })
      );

      expect(result.current.loading).toBe(true);
    });
  });

  describe('successful requests', () => {
    it('should handle successful GET request', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it.skip('should handle successful POST request with body', async () => {
      const mockData: TestData = {
        id: 2,
        name: 'Jane',
        email: 'jane@test.com',
      };
      const requestBody = { name: 'Jane', email: 'jane@test.com' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'POST', body: requestBody },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/test',
        data: requestBody,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
      expect(result.current.data).toEqual(mockData);
    });

    it('should call onSuccess callback when provided', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      const onSuccess = jest.fn();
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
          onSuccess,
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });

    it.skip('should include custom headers', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      const customHeaders = { Authorization: 'Bearer token123' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET', headers: customHeaders },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/test',
        data: undefined,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token123',
          'x-user-role': 'user',
        },
      });
    });
  });

  describe('error handling', () => {
    it('should call onError callback when provided', async () => {
      const networkError = new Error('Network Error');
      const onError = jest.fn();
      mockedAxios.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
          onError,
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(onError).toHaveBeenCalledWith(networkError);
    });

    it('should handle errors without message', async () => {
      const errorWithoutMessage = { response: { status: 500 } };
      mockedAxios.mockRejectedValueOnce(errorWithoutMessage);

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(result.current.error).toBe('An error occurred');
    });
  });

  describe('user role handling', () => {
    it.skip('should include user role in headers by default', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/test',
        data: undefined,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
    });
  });

  describe('automatic execution', () => {
    it('should automatically execute request when executeAutomatically is true', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
          executeAutomatically: true,
        })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockedAxios).toHaveBeenCalledTimes(1);
    });
  });

  describe('timeout handling', () => {
    it.skip('should use custom timeout', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
      };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test',
          options: { method: 'GET' },
          timeout: 10000,
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/test',
        data: undefined,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
    });
  });

  describe('different HTTP methods', () => {
    it.skip('should handle PUT request', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John Updated',
        email: 'john@test.com',
      };
      const requestBody = { name: 'John Updated' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test/1',
          options: { method: 'PUT', body: requestBody },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/test/1',
        data: requestBody,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
    });

    it.skip('should handle DELETE request', async () => {
      mockedAxios.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() =>
        useGetDataFromBackend<{ success: boolean }>({
          url: '/api/test/1',
          options: { method: 'DELETE' },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/test/1',
        data: undefined,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
    });

    it.skip('should handle PATCH request', async () => {
      const mockData: TestData = {
        id: 1,
        name: 'John Patched',
        email: 'john@test.com',
      };
      const requestBody = { name: 'John Patched' };
      mockedAxios.mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() =>
        useGetDataFromBackend<TestData>({
          url: '/api/test/1',
          options: { method: 'PATCH', body: requestBody },
        })
      );

      await act(async () => {
        await result.current.callback();
      });

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/api/test/1',
        data: requestBody,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'user',
        },
      });
    });
  });
});
