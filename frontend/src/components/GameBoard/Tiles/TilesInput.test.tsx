import { render, screen } from '@testing-library/react'
import { type SlotProps } from 'input-otp'
import { describe, expect, it, vi } from 'vitest'
import TilesInput from './TilesInput'

vi.mock('input-otp', () => ({
  OTPInput: (props: {
    render?: (arg: { slots: SlotProps[] }) => React.ReactNode
    maxLength?: number
    'data-testid'?: string
  }) => {
    const mockSlots: SlotProps[] = Array.from({ length: props.maxLength || 10 }, () => ({
      char: '',
      isActive: false,
      hasFakeCaret: false,
      placeholderChar: '',
    }))

    return (
      <div data-testid={props['data-testid'] || 'tiles-input'}>
        {props.render && props.render({ slots: mockSlots })}
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
