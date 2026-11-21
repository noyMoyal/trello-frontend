import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'board'

export const boardService = {
  query,
  getById,
  save,
  remove,
}
window.cs = boardService

async function query(filterBy = { txt: '' }) {
  var boards = await storageService.query(STORAGE_KEY)
  const { txt, sortField, sortDir } = filterBy

  if (txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    boards = boards.filter((board) => regex.test(board.title))
  }
  if (sortField === 'title') {
    boards.sort(
      (board1, board2) =>
        board1[sortField].localeCompare(board2[sortField]) * +sortDir,
    )
  }

  boards = boards.map(({ _id, title, isStarred, style, createdBy }) => ({
    _id,
    title,
    isStarred,
    style,
    createdBy,
  }))
  return boards
}

function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
  // throw new Error('Nope')
  await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    savedBoard = await storageService.put(STORAGE_KEY, board)
  } else {
    const loggedinUser = userService.getLoggedinUser()
    const boardToSave = {
      title: board.title,
      isStarred: board.isStarred,
      style: board.style,
      labels: board.labels,
      members: board.members,
      groups: board.groups,
      activities: board.activities,
      // Later, createdBy is set by the backend
      createdBy: {
        _id: loggedinUser._id,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl,
      },
    }
    savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
  }
  return savedBoard
}
