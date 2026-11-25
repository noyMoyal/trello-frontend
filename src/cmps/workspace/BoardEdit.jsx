import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'

const BOARD_COLORS = [
  { name: 'Teal', color: '#176b60' },
  { name: 'Blue', color: '#356b8a' },
  { name: 'Purple', color: '#6e5dc6' },
  { name: 'Orange', color: '#ae582b' },
  { name: 'Green', color: '#397b54' },
  { name: 'Slate', color: '#526078' },
]

export function BoardEdit({ board, onSaveBoard, onClose }) {
  const [title, setTitle] = useState(board.title)
  const [style, setStyle] = useState({ ...board.style })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const dialogRef = useRef(null)
  const isSubmitting = useRef(false)
  const isEdit = !!board._id

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    dialog.querySelector('#board-title').focus()
    return () => dialog.close()
  }, [])

  async function onSubmit(ev) {
    ev.preventDefault()
    if (isSubmitting.current) return
    if (!title.trim()) {
      setError('Give your board a name.')
      return
    }
    isSubmitting.current = true
    setIsSaving(true)
    setError('')
    try {
      await onSaveBoard({ title: title.trim(), style: { backgroundColor: '#176b60', ...style } })
    } catch (err) {
      setError('We couldn’t save your board. Please try again.')
      setIsSaving(false)
      isSubmitting.current = false
    }
  }

  return (
    <dialog className="board-dialog" ref={dialogRef} aria-labelledby="board-edit-heading" onCancel={ev => {
      ev.preventDefault()
      if (!isSubmitting.current) onClose()
    }}>
      <form onSubmit={onSubmit}>
        <header className="board-dialog-heading">
          <h2 id="board-edit-heading">{isEdit ? 'Edit board' : 'Create board'}</h2>
          <button type="button" className="dialog-close" aria-label="Close" disabled={isSaving} onClick={onClose}>×</button>
        </header>
        <label className="board-title-label" htmlFor="board-title">Board title <span aria-hidden="true">*</span></label>
        <input id="board-title" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="e.g. Team projects" autoFocus required disabled={isSaving} />
        <fieldset disabled={isSaving} className="board-color-picker">
          <legend>Background</legend>
          <div>
            {BOARD_COLORS.map(({ name, color }) => (
              <button key={color} type="button" style={{ backgroundColor: color }} aria-label={`${name} background`}
                aria-pressed={style.backgroundColor === color || (!style.backgroundColor && !style.backgroundImage && color === '#176b60')}
                onClick={() => setStyle({ ...style, backgroundColor: color, backgroundImage: '' })}>
                {style.backgroundColor === color || (!style.backgroundColor && !style.backgroundImage && color === '#176b60') ? '✓' : ''}
              </button>
            ))}
          </div>
        </fieldset>
        {error && <p className="board-dialog-error" role="alert">{error}</p>}
        <footer className="board-dialog-actions">
          <button type="button" className="workspace-secondary" disabled={isSaving} onClick={onClose}>Cancel</button>
          <button className="workspace-primary" disabled={isSaving}>{isSaving ? 'Saving…' : isEdit ? 'Save changes' : 'Create board'}</button>
        </footer>
      </form>
    </dialog>
  )
}

BoardEdit.propTypes = {
  board: PropTypes.shape({ _id: PropTypes.string, title: PropTypes.string.isRequired, style: PropTypes.object }).isRequired,
  onSaveBoard: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
