import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'

export function BoardRemove({ board, onRemoveBoard, onClose }) {
  const dialogRef = useRef(null)
  const isSubmitting = useRef(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  async function onSubmit(ev) {
    ev.preventDefault()
    if (isSubmitting.current) return
    isSubmitting.current = true
    setIsRemoving(true)
    setError('')
    try {
      await onRemoveBoard()
    } catch (err) {
      setError('We couldn’t delete this board. Please try again.')
      setIsRemoving(false)
      isSubmitting.current = false
    }
  }

  return (
    <dialog className="board-dialog" ref={dialogRef} aria-labelledby="board-remove-heading" aria-describedby="board-remove-description" onCancel={ev => {
      ev.preventDefault()
      if (!isSubmitting.current) onClose()
    }}>
      <form onSubmit={onSubmit}>
        <header className="board-dialog-heading">
          <h2 id="board-remove-heading">Delete board?</h2>
          <button type="button" className="dialog-close" aria-label="Close" disabled={isRemoving} onClick={onClose}>×</button>
        </header>
        <p id="board-remove-description">“{board.title}” and all its lists and cards will be permanently deleted.</p>
        {error && <p className="board-dialog-error" role="alert">{error}</p>}
        <footer className="board-dialog-actions">
          <button type="button" className="workspace-secondary" disabled={isRemoving} autoFocus onClick={onClose}>Cancel</button>
          <button className="workspace-danger" disabled={isRemoving}>{isRemoving ? 'Deleting…' : 'Delete board'}</button>
        </footer>
      </form>
    </dialog>
  )
}

BoardRemove.propTypes = {
  board: PropTypes.shape({ title: PropTypes.string.isRequired }).isRequired,
  onRemoveBoard: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
