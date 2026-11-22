import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

export function BoardPreview({ board, onToggleStar, onUpdateBoard, onRemoveBoard, isPending }) {
  const menuRef = useRef(null)
  const { backgroundColor, backgroundImage } = board.style || {}
  const coverStyle = {
    backgroundColor: backgroundColor || '#0c66e4',
    backgroundImage: backgroundImage
      ? (backgroundImage.startsWith('url(') ? backgroundImage : `url("${backgroundImage}")`)
      : undefined,
  }

  useEffect(() => {
    function onPointerDown(ev) {
      if (!menuRef.current?.contains(ev.target)) menuRef.current?.removeAttribute('open')
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function onAction(action) {
    menuRef.current.removeAttribute('open')
    menuRef.current.querySelector('summary').focus()
    action(board)
  }

  return (
    <article className="board-preview">
      <Link className="board-cover" to={`/board/${board._id}`} style={coverStyle} aria-label={`Open ${board.title}`}>
        <span className="board-cover-shape" aria-hidden="true" />
        <span className="board-cover-title">{board.title}</span>
      </Link>
      <button
        className={`board-star ${board.isStarred ? 'is-starred' : ''}`}
        aria-label={`${board.isStarred ? 'Unstar' : 'Star'} ${board.title}`}
        aria-pressed={board.isStarred}
        disabled={isPending}
        onClick={() => onToggleStar(board)}
      >{board.isStarred ? '★' : '☆'}</button>
      <div className="board-card-footer">
        <div className="board-card-info">
          <Link to={`/board/${board._id}`}>{board.title}</Link>
          <span>Workspace board</span>
        </div>
        <details className="board-menu" ref={menuRef} onKeyDown={ev => {
          if (ev.key === 'Escape') {
            ev.preventDefault()
            menuRef.current.removeAttribute('open')
            menuRef.current.querySelector('summary').focus()
          }
        }}>
          <summary aria-label={`Actions for ${board.title}`}>···</summary>
          <div className="board-menu-content">
            <button disabled={isPending} onClick={() => onAction(onUpdateBoard)}>Edit board</button>
            <button className="board-delete-action" disabled={isPending} onClick={() => onAction(onRemoveBoard)}>Delete board</button>
          </div>
        </details>
      </div>
    </article>
  )
}

BoardPreview.propTypes = {
  board: PropTypes.shape({ _id: PropTypes.string.isRequired, title: PropTypes.string.isRequired, isStarred: PropTypes.bool, style: PropTypes.object }).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  onUpdateBoard: PropTypes.func.isRequired,
  onRemoveBoard: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
}
