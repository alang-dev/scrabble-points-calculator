import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import GlobalErrorBanner from './GlobalErrorBanner'
import { mockSetGlobalErrorHandler } from './test/apiMocks'

describe('GlobalErrorBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render nothing when there is no error', () => {
    render(<GlobalErrorBanner />)

    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument()
  })

  it('should set up global error handler on mount', () => {
    render(<GlobalErrorBanner />)

    expect(mockSetGlobalErrorHandler).toHaveBeenCalledTimes(1)
    expect(mockSetGlobalErrorHandler).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should render error banner when error is set', () => {
    render(<GlobalErrorBanner />)

    // Get the error handler function that was passed to setGlobalErrorHandler
    const errorHandler = mockSetGlobalErrorHandler.mock.calls[0][0]

    // Trigger an error
    act(() => {
      errorHandler('Test error message')
    })

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should dismiss error when close button is clicked', () => {
    render(<GlobalErrorBanner />)

    const errorHandler = mockSetGlobalErrorHandler.mock.calls[0][0]

    // Trigger an error
    act(() => {
      errorHandler('Test error message')
    })

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()

    // Click dismiss button
    const dismissButton = screen.getByLabelText('Dismiss error')
    fireEvent.click(dismissButton)

    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument()
  })

  it('should auto-hide error after 5 seconds', () => {
    render(<GlobalErrorBanner />)

    const errorHandler = mockSetGlobalErrorHandler.mock.calls[0][0]

    // Trigger an error
    act(() => {
      errorHandler('Test error message')
    })

    expect(screen.getByTestId('error-banner')).toBeInTheDocument()

    // Fast-forward time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.queryByTestId('error-banner')).not.toBeInTheDocument()
  })

  it('should have proper CSS classes applied', () => {
    render(<GlobalErrorBanner />)

    const errorHandler = mockSetGlobalErrorHandler.mock.calls[0][0]

    act(() => {
      errorHandler('Test error message')
    })

    const errorBanner = screen.getByTestId('error-banner')
    expect(errorBanner).toHaveClass(
      'max-w-4xl',
      'mx-auto',
      'mb-4',
      'bg-red-50',
      'border',
      'border-red-200',
      'rounded-lg',
      'p-4'
    )
  })
})
