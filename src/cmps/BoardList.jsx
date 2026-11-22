import PropTypes from 'prop-types'
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onToggleStar, pendingIds }) {
  return (
    <ul className="board-list">
      {boards.map(board => (
        <li key={board._id}>
          <BoardPreview
            board={board}
            onToggleStar={onToggleStar}
            isPending={pendingIds.includes(board._id)}
          />
        </li>
      ))}
    </ul>
  )
}

BoardList.propTypes = {
  boards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  pendingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}
