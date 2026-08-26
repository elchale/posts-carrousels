'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/** One transient line of feedback at a time. Confirmations only — errors get a
 *  persistent line next to the control that failed. */
export function useToast() {
  const [message, setMessage] = useState(null)
  const timer = useRef(null)

  const show = useCallback((text, ms = 2200) => {
    setMessage({ text, at: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), ms)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const node = message ? (
    <div className="toast" role="status" aria-live="polite" key={message.at}>
      {message.text}
    </div>
  ) : null

  return [node, show]
}
