import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadBoard } from '../store/actions/board.actions'
import { BoardGroup } from '../cmps/BoardGroup'

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
              <BoardGroup
                key={group.id}
                group={group}
                labels={board.labels}
                members={board.members}
              />
            ))}
          </section>
        </div>
      )}
    </section>
  )
}
