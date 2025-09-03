export const serializeParams = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return
    }
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, item))
    } else {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}
