import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Toaster } from './Toaster'

vi.mock('sonner', () => ({
  Toaster: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="toaster" {...props}>
      {children}
    </div>
  ),
}))

describe('Toaster', () => {
  it('should render toaster component', () => {
    render(<Toaster />)

    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })
})
