import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TilesInput from './TilesInput'

vi.mock('input-otp', () => ({
  OTPInput: ({ render: renderProp, ...props }: any) => {
    const mockSlots = Array.from({ length: props.maxLength || 10 }, () => ({
      char: '',
      isActive: false,
      hasFakeCaret: false,
    }))

    return (
      <div data-testid={props['data-testid'] || 'tiles-input'}>
        {renderProp({ slots: mockSlots })}
      </div>
    )
  },
}))

describe('TilesInput', () => {
  it('should render input component', () => {
    render(<TilesInput maxLength={10} />)

    expect(screen.getByTestId('tiles-input')).toBeInTheDocument()
  })
})
