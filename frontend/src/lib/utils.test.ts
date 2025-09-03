import { cn, formatDateTime } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const condition1 = true
      const condition2 = false
      expect(cn('class1', condition1 && 'class2', condition2 && 'class3')).toBe('class1 class2')
    })

    it('should handle tailwind merge conflicts', () => {
      expect(cn('px-2 px-4')).toBe('px-4')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
    })

    it('should handle null and undefined', () => {
      expect(cn(null, undefined, 'class1')).toBe('class1')
    })
  })

  describe('formatDateTime', () => {
    it.each([
      [
        '2023-01-01T12:30:45.123Z',
        '2023-01-01T12:30:45',
        'should extract YYYY-MM-DDTHH:MM:ss from ISO string with milliseconds',
      ],
      [
        '2023-12-31T23:59:59Z',
        '2023-12-31T23:59:59',
        'should extract YYYY-MM-DDTHH:MM:ss from ISO string without milliseconds',
      ],
      [
        '2023-06-15T08:00:00.000000Z',
        '2023-06-15T08:00:00',
        'should extract YYYY-MM-DDTHH:MM:ss from ISO string with microseconds',
      ],
    ])('%s → %s (%s)', (input, expected) => {
      expect(formatDateTime(input)).toBe(expected)
    })

    it('should handle short strings by returning what is available', () => {
      expect(formatDateTime('2023')).toBe('2023')
    })

    it('should handle empty string', () => {
      expect(formatDateTime('')).toBe('')
    })
  })
})
