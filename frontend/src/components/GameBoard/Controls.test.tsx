import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Controls from './Controls'

// Mock the useGameBoard hook
const mockHandleReset = vi.fn()
const mockHandleSave = vi.fn()
const mockCanSave = true

vi.mock('./hooks/useGameBoard', () => ({
  useGameBoard: () => ({
    handleReset: mockHandleReset,
    handleSave: mockHandleSave,
    canSave: mockCanSave,
  }),
}))

// Mock the TopScoresModal component
vi.mock('./TopScoresModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="top-scores-modal">
        <button onClick={onClose} data-testid="close-modal">
          Close
        </button>
      </div>
    ) : null,
}))

describe('Controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all control buttons', () => {
    render(<Controls />)

    expect(screen.getByTestId('reset-button')).toBeInTheDocument()
    expect(screen.getByTestId('save-button')).toBeInTheDocument()
    expect(screen.getByTestId('view-top-scores-button')).toBeInTheDocument()
  })

  it('should render with custom className', () => {
    const { container } = render(<Controls className="custom-class" />)

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should call handleReset when reset button is clicked', () => {
    render(<Controls />)

    fireEvent.click(screen.getByTestId('reset-button'))

    expect(mockHandleReset).toHaveBeenCalledTimes(1)
  })

  it('should call handleSave when save button is clicked', () => {
    render(<Controls />)

    fireEvent.click(screen.getByTestId('save-button'))

    expect(mockHandleSave).toHaveBeenCalledTimes(1)
  })

  it('should open top scores modal when view top scores button is clicked', () => {
    render(<Controls />)

    fireEvent.click(screen.getByTestId('view-top-scores-button'))

    expect(screen.getByTestId('top-scores-modal')).toBeInTheDocument()
  })

  it('should close top scores modal when close is called', () => {
    render(<Controls />)

    // Open modal
    fireEvent.click(screen.getByTestId('view-top-scores-button'))
    expect(screen.getByTestId('top-scores-modal')).toBeInTheDocument()

    // Close modal
    fireEvent.click(screen.getByTestId('close-modal'))
    expect(screen.queryByTestId('top-scores-modal')).not.toBeInTheDocument()
  })
})
