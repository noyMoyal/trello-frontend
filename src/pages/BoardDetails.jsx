import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showErrorMsg } from '../services/event-bus.service'
import { loadBoard, updateBoard } from '../store/actions/board.actions'
import { makeId } from '../services/util.service'
import { BoardGroup } from '../cmps/BoardGroup'
import { TaskEdit } from '../cmps/task/TaskEdit'

export function BoardDetails() {
  const { boardId } = useParams()
  const board = useSelector((storeState) => storeState.boardModule.board)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    loadBoard(boardId)
  }, [boardId])

  async function onAddTask(groupId) {
    const title = prompt('Card title?')
    if (!title) return

    const task = { id: makeId(), title }
    const groups = board.groups.map((group) =>
      group.id === groupId
        ? { ...group, tasks: [...group.tasks, task] }
        : group,
    )

    try {
      await updateBoard({ ...board, groups })
    } catch (err) {
      showErrorMsg('Cannot add card')
    }
  }

  async function onSaveTask(updatedTask) {
    const updatedBoard = {
      ...board,
      groups: board.groups.map((group) => ({
        ...group,
        tasks: group.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      })),
    }

    try {
      await updateBoard(updatedBoard)
      setSelectedTask(null)
    } catch (err) {
      showErrorMsg('Cannot save card')
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
            {board.groups.map((group) => (
              <BoardGroup
                key={group.id}
                group={group}
                labels={board.labels}
                members={board.members}
                onAddTask={onAddTask}
                onSelectTask={setSelectedTask}
              />
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
