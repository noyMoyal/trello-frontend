import { Link } from 'react-router-dom'

export function BoardPreview({ board }) {
  return (
    <article className="board-preview">
      <header>
        <Link to={`/board/${board._id}`}>{board.title}</Link>
      </header>

      {board.createdBy && (
        <p>
          Created by: <span>{board.createdBy.fullname}</span>
        </p>
      )}
    </article>
  )
}
