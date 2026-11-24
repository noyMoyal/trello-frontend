
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { loadBoard, updateBoard } from '../store/actions/board.actions'
import { TaskEdit } from '../cmps/task/TaskEdit'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector(state => state.boardModule.board)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  async function onSaveTask(updatedTask) {
    const updatedBoard = {
      ...board,
      groups: board.groups.map(group => ({
        ...group,
        tasks: group.tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      }))
    }

    try {
      await updateBoard(updatedBoard)
      setSelectedTask(null)
    } catch (err) {
      console.error('Cannot save task', err)
      alert('Cannot save task')
    }
  }

  return (
    <section className="board-details">
      <Link to="/board">Back to list</Link>
      <h1>Board Details</h1>

      {board && (
        <div>
          <h3>{board.title}</h3>

          <section className="group-container">
            {board.groups.map(group => (
              <section key={group.id} className="group">
                <h4>{group.title}</h4>

                {group.tasks.map(task => (
                  <article
                    key={task.id}
                    className="task"
                    onClick={() => setSelectedTask(task)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={ev => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault()
                        setSelectedTask(task)
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <p>{task.title}</p>
                  </article>
                ))}
              </section>
            ))}
          </section>
        </div>
      )}

      {selectedTask && board && (
        <TaskEdit
          task={selectedTask}
          board={board}
          onSave={onSaveTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </section>
  )
}


