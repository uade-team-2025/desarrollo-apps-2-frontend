import { act, renderHook } from '@testing-library/react';
import useLocalStorage from '../../core/hooks/useLocalStorage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with initial value when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current.value).toBe('initialValue');
      expect(result.current.error).toBe(null);
    });

    it('should initialize with stored value when localStorage has data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify('storedValue'));

      const { result } = renderHook(() => useLocalStorage('testKey', {}));

      expect(result.current.value).toBe('storedValue');
    });

    it('should initialize with stored string value directly', () => {
      localStorageMock.getItem.mockReturnValue('storedString');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      expect(result.current.value).toBe('storedString');
    });
  });

  describe('setValue', () => {
    it('should set string value directly', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current.setValue('newValue');
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        'newValue'
      );
      expect(result.current.value).toBe('newValue');
    });

    it('should set object value as JSON', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const objectValue = { name: 'test', id: 1 };

      const { result } = renderHook(() => useLocalStorage('testKey', {}));

      act(() => {
        result.current.setValue(objectValue);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'testKey',
        JSON.stringify(objectValue)
      );
      expect(result.current.value).toEqual(objectValue);
    });

    it('should handle function updates', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(5));

      const { result } = renderHook(() => useLocalStorage('testKey', 0));

      act(() => {
        result.current.setValue((prev) => prev + 10);
      });

      expect(result.current.value).toBe(15);
    });

    it('should handle localStorage setItem errors', () => {
      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current.setValue('newValue');
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Storage quota exceeded');
    });
  });

  describe('removeValue', () => {
    it('should remove value and reset to initial value', () => {
      localStorageMock.getItem.mockReturnValue('storedValue');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initialValue')
      );

      act(() => {
        result.current.removeValue();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('testKey');
      expect(result.current.value).toBe('initialValue');
    });

    it('should handle localStorage removeItem errors', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Remove failed');
      });

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        result.current.removeValue();
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Remove failed');
    });
  });

  describe('storage events', () => {
    it('should update value when storage event is fired for string values', () => {
      localStorageMock.getItem.mockReturnValue('initial');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'testKey',
          newValue: 'updatedValue',
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current.value).toBe('updatedValue');
    });

    it('should update value when storage event is fired for object values', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({}));
      const newObjectValue = { updated: true };

      const { result } = renderHook(() => useLocalStorage('testKey', {}));

      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'testKey',
          newValue: JSON.stringify(newObjectValue),
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current.value).toEqual(newObjectValue);
    });

    it('should handle storage event with null value', () => {
      localStorageMock.getItem.mockReturnValue('initial');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'testKey',
          newValue: null,
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current.value).toBe(null);
    });

    it('should ignore storage events for different keys', () => {
      localStorageMock.getItem.mockReturnValue('initial');

      const { result } = renderHook(() =>
        useLocalStorage('testKey', 'initial')
      );

      const initialValue = result.current.value;

      act(() => {
        const storageEvent = new StorageEvent('storage', {
          key: 'differentKey',
          newValue: 'shouldNotUpdate',
        });
        window.dispatchEvent(storageEvent);
      });

      expect(result.current.value).toBe(initialValue);
    });
  });
});
