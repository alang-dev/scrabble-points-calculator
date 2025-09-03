import { fireEvent, render, screen } from '@testing-library/react'
import { X } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import Button, { IconButton } from './Button'

vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="mock-icon" />,
}))

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply different variants', () => {
    render(<Button variant="outline">Outline Button</Button>)

    const button = screen.getByText('Outline Button')
    expect(button).toHaveClass('border-gray-300')
  })

  it('should apply different sizes', () => {
    render(<Button size="lg">Large Button</Button>)

    const button = screen.getByText('Large Button')
    expect(button).toHaveClass('h-12')
  })
})

describe('IconButton', () => {
  it('should render icon button with text', () => {
    render(<IconButton icon={X}>Icon Button</IconButton>)

    expect(screen.getByText('Icon Button')).toBeInTheDocument()
  })
})
