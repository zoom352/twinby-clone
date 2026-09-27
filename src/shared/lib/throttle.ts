export const throttle = <Args extends unknown[]>(fn: (...args: Args) => void, ms: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Args

  return (...args: Args) => {
    lastArgs = args
    if (timer) return
    timer = setTimeout(() => {
      timer = null
      fn(...lastArgs)
    }, ms)
  }
}
