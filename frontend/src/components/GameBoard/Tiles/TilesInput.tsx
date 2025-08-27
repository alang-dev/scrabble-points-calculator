import { OTPInput, type OTPInputProps, type SlotProps } from 'input-otp'
import React, { useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'

interface TilesInputBaseProps {
  autoCapitalize?: 'on' | 'off'
  'data-testid'?: string
}

interface TileSlotProps extends SlotProps, TilesInputBaseProps {}
const TileSlot: React.FC<TileSlotProps> = ({
  char,
  isActive,
  autoCapitalize = true,
  hasFakeCaret,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative flex h-16 w-16 items-center justify-center border border-gray-300 text-xl font-bold rounded-lg transition-all',
        isActive && 'border-blue-500 ring-1 ring-blue-500',
        'focus:outline-none'
      )}
      {...props}
    >
      {autoCapitalize == 'on' ? char?.toUpperCase() : char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px animate-pulse bg-black" />
        </div>
      )}
    </div>
  )
}

type TilesInputProps = TilesInputBaseProps &
  Partial<OTPInputProps> & {
    maxLength: number
  }

const TilesInput: React.FC<TilesInputProps> = props => {
  const {
    className,
    children, // eslint-disable-line @typescript-eslint/no-unused-vars
    autoCapitalize,
    autoFocus,
    'data-testid': dataTestId = 'tiles-input',
    ...restProps
  } = props
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current && autoFocus) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  return (
    <div className={cn('flex justify-center', className)}>
      <OTPInput
        {...restProps}
        ref={inputRef}
        autoFocus={autoFocus}
        inputMode="text"
        containerClassName={cn(
          'flex items-center gap-3 has-[:disabled]:opacity-50',
          'group flex items-center has-[:disabled]:opacity-30 gap-3'
        )}
        render={({ slots }) => (
          <div className="flex items-center gap-3">
            {slots.map((slot, index) => (
              <TileSlot
                key={index}
                {...slot}
                autoCapitalize={autoCapitalize}
                data-testid={`tile-${index}`}
              />
            ))}
          </div>
        )}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default TilesInput
