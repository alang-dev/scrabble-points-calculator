export const serializeParams = (params: Record<string, unknown>) => {
  const serializeValue = (value: unknown): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    return String(value)
  }

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, serializeValue(item)))
    } else {
      searchParams.append(key, serializeValue(value))
    }
  })
  return searchParams.toString()
}
