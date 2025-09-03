import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Modal from './Modal'

vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog-root">{children}</div> : null,
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-portal">{children}</div>
  ),
  Overlay: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-overlay" {...props}>
      {children}
    </div>
  ),
  Content: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-content" {...props}>
      {children}
    </div>
  ),
  Title: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <h2 data-testid="dialog-title" {...props}>
      {children}
    </h2>
  ),
  Close: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) =>
    asChild ? children : <button data-testid="dialog-close">{children}</button>,
}))

vi.mock('lucide-react', () => ({
  X: () => <span data-testid="x-icon">×</span>,
}))

describe('Modal', () => {
  it('should render modal when open', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.getByTestId('dialog-root')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('should not render modal when closed', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={false} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.queryByTestId('dialog-root')).not.toBeInTheDocument()
  })

  it('should render modal without title', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Modal content</p>
      </Modal>
    )

    expect(screen.getByTestId('dialog-root')).toBeInTheDocument()
    expect(screen.queryByTestId('dialog-title')).not.toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })
})
