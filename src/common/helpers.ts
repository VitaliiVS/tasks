export const debounce = (func: any, ms: number): (() => void) => {
  let timeout: any

  return (...args: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func(...args)
    }, ms)
  }
}
