import { serializeParams } from './serializers'

describe('serializers', () => {
  describe('serializeParams', () => {
    it.each([
      [{ key1: 'value1', key2: 'value2' }, 'key1=value1&key2=value2'],
      [{ sort: ['name,asc', 'date,desc'] }, 'sort=name%2Casc&sort=date%2Cdesc'],
      [{ string: 'test', number: 42, boolean: true }, 'string=test&number=42&boolean=true'],
      [{}, ''],
      [{ mixed: ['item1', 'item2'], single: 'value' }, 'mixed=item1&mixed=item2&single=value'],
      [{ special: 'hello world', encoded: 'a+b=c' }, 'special=hello+world&encoded=a%2Bb%3Dc'],
      [{ valid: 'test', ignored: null }, 'valid=test'],
      [{ valid: 'test', ignored: undefined }, 'valid=test'],
    ])('should serialize params %o to %s', (params, expected) => {
      expect(serializeParams(params)).toBe(expected)
    })

    it('should ignore null and undefined values', () => {
      expect(
        serializeParams({
          nullValue: null,
          undefinedValue: undefined,
          valid: 'test',
        })
      ).toBe('valid=test')
    })

    it('should return empty string when all values are null or undefined', () => {
      expect(
        serializeParams({
          nullValue: null,
          undefinedValue: undefined,
        })
      ).toBe('')
    })

    it('should handle empty arrays', () => {
      expect(
        serializeParams({
          emptyArray: [],
          valid: 'test',
        })
      ).toBe('valid=test')
    })

    it('should handle nested objects by converting to string', () => {
      expect(
        serializeParams({
          object: { nested: 'value' },
          valid: 'test',
        })
      ).toBe('object=%5Bobject+Object%5D&valid=test')
    })
  })
})
