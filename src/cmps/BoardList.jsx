import PropTypes from 'prop-types'
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards }) {
  return (
    <ul className="board-list">
      {boards.map(board => (
        <li key={board._id}>
          <BoardPreview
            board={board}
          />
        </li>
      ))}
    </ul>
  )
}

BoardList.propTypes = {
  boards: PropTypes.arrayOf(PropTypes.object).isRequired,
}
