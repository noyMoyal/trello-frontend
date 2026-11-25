import PropTypes from 'prop-types'
import { Plus } from 'lucide-react'
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards, onToggleStar, onUpdateBoard, onRemoveBoard, onCreateBoard, pendingIds }) {
  return (
    <ul className="board-list">
      {boards.map(board => (
        <li key={board._id}>
          <BoardPreview
            board={board}
            onToggleStar={onToggleStar}
            onUpdateBoard={onUpdateBoard}
            onRemoveBoard={onRemoveBoard}
            isPending={pendingIds.includes(board._id)}
          />
        </li>
      ))}
      {onCreateBoard && (
        <li>
          <button className="board-create-tile" onClick={onCreateBoard}>
            <span className="board-create-icon" aria-hidden="true"><Plus size={24} /></span>
            <span>Create a board</span>
            <small>Start a new project</small>
          </button>
        </li>
      )}
    </ul>
  )
}

BoardList.propTypes = {
  boards: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  onUpdateBoard: PropTypes.func.isRequired,
  onRemoveBoard: PropTypes.func.isRequired,
  onCreateBoard: PropTypes.func,
  pendingIds: PropTypes.arrayOf(PropTypes.string).isRequired,
}
