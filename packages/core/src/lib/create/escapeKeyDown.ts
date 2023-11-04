import { access } from '@lib/utils'
import { createEffect, onCleanup } from 'solid-js'
import type { MaybeAccessor } from '@lib/types'

const createEscapeKeyDown = (props: {
  onEscapeKeyDown: (event: KeyboardEvent) => void
  isDisabled?: MaybeAccessor<boolean>
  ownerDocument?: MaybeAccessor<Document | null>
}) => {
  createEffect(() => {
    if (access(props.isDisabled)) {
      return
    }

    const ownerDocument = access(props.ownerDocument) ?? document
    ownerDocument.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
      ownerDocument.removeEventListener('keydown', handleKeyDown)
    })
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      props.onEscapeKeyDown(event)
    }
  }
}

export default createEscapeKeyDown
