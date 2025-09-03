import { describe, expect, it, vi } from 'vitest'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

import { toast as sonnerToast } from 'sonner'
import { toast } from './toast'

describe('toast', () => {
  it('should have toast methods available', () => {
    expect(typeof toast.success).toBe('function')
    expect(typeof toast.error).toBe('function')
    expect(typeof toast.info).toBe('function')
    expect(typeof toast.warning).toBe('function')
  })

  it('should call sonner toast.success when success is called', () => {
    const message = 'Success message'
    toast.success(message)
    expect(sonnerToast.success).toHaveBeenCalledWith(message)
  })

  it('should call sonner toast.error when error is called', () => {
    const message = 'Error message'
    toast.error(message)
    expect(sonnerToast.error).toHaveBeenCalledWith(message)
  })

  it('should call sonner toast.info when info is called', () => {
    const message = 'Info message'
    toast.info(message)
    expect(sonnerToast.info).toHaveBeenCalledWith(message)
  })

  it('should call sonner toast.warning when warning is called', () => {
    const message = 'Warning message'
    toast.warning(message)
    expect(sonnerToast.warning).toHaveBeenCalledWith(message)
  })
})
