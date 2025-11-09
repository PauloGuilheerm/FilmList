import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should expose passthrough value immediately and update debounced after delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 500 } }
    );

    expect(result.current.value).toBe('');
    expect(result.current.debouncedValue).toBe('');

    rerender({ value: 'hello', delay: 500 });

    expect(result.current.value).toBe('hello');
    expect(result.current.debouncedValue).toBe('');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(result.current.debouncedValue).toBe('hello');
  });

  it('should reset timer on rapid changes and only emit the last value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 300 } }
    );

    rerender({ value: 'a', delay: 300 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    rerender({ value: 'ab', delay: 300 });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150);
    });
    rerender({ value: 'abc', delay: 300 });

    expect(result.current.debouncedValue).not.toBe('abc');
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(result.current.debouncedValue).toBe('abc');
  });
});


