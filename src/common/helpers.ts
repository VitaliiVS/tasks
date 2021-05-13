export const debounce = (func: (...args: any) => any, ms: number) => {
  let timeout: any

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, ms)
  }
}
