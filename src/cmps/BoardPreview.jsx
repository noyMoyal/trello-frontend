import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function BoardPreview({ board, onToggleStar, isPending }) {
  const { backgroundColor, backgroundImage } = board.style || {}
  const coverStyle = {
    backgroundColor: backgroundColor || '#0c66e4',
    backgroundImage: backgroundImage
      ? (backgroundImage.startsWith('url(') ? backgroundImage : `url("${backgroundImage}")`)
      : undefined,
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
      </div>
    </article>
  )
}

BoardPreview.propTypes = {
  board: PropTypes.shape({ _id: PropTypes.string.isRequired, title: PropTypes.string.isRequired, isStarred: PropTypes.bool, style: PropTypes.object }).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
}
