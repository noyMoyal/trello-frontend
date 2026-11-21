import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard } from '../store/actions/board.actions'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector((storeState) => storeState.boardModule.board)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  return (
    <section className="board-details">
      <Link to="/board">Back to list</Link>
      <h1>Board Details</h1>
      {board && (
        <div>
          <h3>{board.title}</h3>
          <section className="group-container">
            {board.groups.map((group) => (
              <section key={group.id} className="group">
                <h4>{group.title}</h4>
                {group.tasks.map((task) => (
                  <article key={task.id} className="task">
                    <p>{task.title}</p>
                  </article>
                ))}
              </section>
            ))}
          </section>{' '}
        </div>
      )}
    </section>
  )
}
