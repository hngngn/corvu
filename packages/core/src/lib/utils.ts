import { isFunction } from '@lib/assertions'
import { MaybeAccessor, MaybeAccessorValue } from '@lib/types'
import type { Accessor, JSX } from 'solid-js'

const callEventHandler = <T, E extends Event>(
  eventHandler: JSX.EventHandlerUnion<T, E> | undefined,
  event: E & { currentTarget: T; target: Element },
) => {
  if (eventHandler) {
    if (isFunction(eventHandler)) {
      eventHandler(event)
    } else {
      eventHandler[0](eventHandler[1], event)
    }
  }

  return event?.defaultPrevented
}

const access = <T extends MaybeAccessor<unknown>>(
  v: T,
): MaybeAccessorValue<T> => (typeof v === 'function' ? v() : v)

const some = (...signals: Accessor<unknown>[]) => {
  return signals.some((signal) => !!signal())
}

const chain = <Args extends [] | unknown[]>(callbacks: {
  [Symbol.iterator](): IterableIterator<
    ((...args: Args) => unknown) | undefined
  >
}): ((...args: Args) => void) => {
  return (...args: Args) => {
    for (const callback of callbacks) callback && callback(...args)
  }
}

const mergeRefs = <T>(
  ...refs: (((val: T) => void) | undefined)[]
): ((el: T) => void) => {
  return chain(refs)
}

const dataIf = (condition: boolean) => (condition ? '' : undefined)

export { callEventHandler, access, some, chain, mergeRefs, dataIf }