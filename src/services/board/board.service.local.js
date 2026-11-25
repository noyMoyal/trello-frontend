import { storageService } from '../async-storage.service'
import { loadFromStorage, saveToStorage } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'board'

_createBoards()

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
    const loggedinUser = userService.getLoggedinUser() || {
      _id: 'guest', fullname: 'Guest', imgUrl: '',
    }
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
function _createBoards() {
  var boards = loadFromStorage(STORAGE_KEY)
  if (boards) return

  const maya = { _id: 'u101', fullname: 'Maya Levi', imgUrl: '' }
  const daniel = { _id: 'u102', fullname: 'Daniel Cohen', imgUrl: '' }
  const shira = { _id: 'u103', fullname: 'Shira Ben David', imgUrl: '' }
  const omer = { _id: 'u104', fullname: 'Omer Katz', imgUrl: '' }
  const lior = { _id: 'u105', fullname: 'Lior Avraham', imgUrl: '' }

  boards = [
    {
      _id: 'b101',
      title: 'HQ Office App',
      isStarred: true,
      createdBy: maya,
      style: { backgroundImage: '' },
      labels: [
        { id: 'l101', title: 'Frontend', color: '#4bce97' },
        { id: 'l102', title: 'Backend', color: '#579dff' },
        { id: 'l103', title: 'Bug', color: '#f87168' },
        { id: 'l104', title: 'Design', color: '#9f8fef' },
        { id: 'l105', title: 'Yoga', color: '#6cc3e0' },
        { id: 'l106', title: 'Lunch', color: '#fea362' },
        { id: 'l107', title: 'Urgent', color: '#c9372c' },
      ],
      members: [maya, daniel, shira, omer, lior],
      groups: [
        {
          id: 'g101',
          title: 'Backlog-Server',
          style: {},
          tasks: [
            {
              id: 'c101',
              title: 'Yoga classes API',
              labelIds: ['l102', 'l105'],
              memberIds: ['u102'],
            },
            {
              id: 'c102',
              title: 'Lunch orders API',
              labelIds: ['l102', 'l106'],
              memberIds: ['u102'],
            },
            {
              id: 'c103',
              title: 'Daily lunch summary email to office manager',
              description:
                'Send at 11:15 after the order deadline. Group by restaurant.',
              labelIds: ['l102', 'l106'],
              dueDate: '2026-12-08',
            },
            {
              id: 'c104',
              title: 'Max 12 participants per class',
              labelIds: ['l102', 'l105'],
            },
            {
              id: 'c105',
              title: 'User roles: employee, instructor, office manager',
              labelIds: ['l102'],
              memberIds: ['u104'],
              checklists: [
                {
                  id: 'cl101',
                  title: 'Roles',
                  todos: [
                    { id: 'td101', title: 'Employee', isDone: false },
                    { id: 'td102', title: 'Instructor', isDone: false },
                    { id: 'td103', title: 'Office manager', isDone: false },
                  ],
                },
              ],
            },
            {
              id: 'c106',
              title: 'Export monthly orders to CSV',
              labelIds: ['l102', 'l106'],
              dueDate: '2026-12-20',
            },
          ],
        },
        {
          id: 'g102',
          title: 'Backlog-Client',
          style: {},
          tasks: [
            {
              id: 'c107',
              title: 'Weekly yoga schedule',
              labelIds: ['l101', 'l105', 'l104'],
              memberIds: ['u103'],
            },
            {
              id: 'c108',
              title: 'Book / cancel a class',
              labelIds: ['l101', 'l105'],
            },
            {
              id: 'c109',
              title: 'Instructor page - manage classes',
              labelIds: ['l101', 'l105'],
            },
            {
              id: 'c110',
              title: 'Lunch menu page',
              labelIds: ['l101', 'l106'],
              memberIds: ['u105'],
            },
            {
              id: 'c111',
              title: "Office manager dashboard - today's orders",
              labelIds: ['l101', 'l106'],
              style: { backgroundColor: '#fea362' },
            },
            { id: 'c112', title: 'Empty states', labelIds: ['l104'] },
            { id: 'c113', title: 'Dark mode', labelIds: ['l101', 'l104'] },
          ],
        },
        {
          id: 'g103',
          title: 'In Development',
          style: {},
          tasks: [
            {
              id: 'c114',
              title: 'Lunch order form',
              description:
                'Dish, notes (vegan, gluten free), pickup or delivery.',
              dueDate: '2026-11-25',
              labelIds: ['l101', 'l106'],
              memberIds: ['u105', 'u103'],
              checklists: [
                {
                  id: 'cl102',
                  title: 'Form',
                  todos: [
                    { id: 'td104', title: 'Choose dish', isDone: true },
                    { id: 'td105', title: 'Notes field', isDone: true },
                    { id: 'td106', title: 'Validation', isDone: false },
                    { id: 'td107', title: 'Save order', isDone: false },
                  ],
                },
              ],
            },
            {
              id: 'c115',
              title: 'Class booking flow',
              dueDate: '2026-11-27',
              labelIds: ['l101', 'l105'],
              memberIds: ['u103'],
            },
            {
              id: 'c116',
              title: 'Login with company email',
              labelIds: ['l102'],
              memberIds: ['u104'],
            },
          ],
        },
        {
          id: 'g104',
          title: 'QA',
          style: {},
          tasks: [
            {
              id: 'c117',
              title: 'Can book a full class',
              labelIds: ['l103', 'l105'],
              memberIds: ['u101'],
            },
            {
              id: 'c118',
              title: 'Orders after 11:00 still accepted',
              labelIds: ['l103', 'l106', 'l107'],
              memberIds: ['u102'],
              dueDate: '2026-11-23',
            },
            {
              id: 'c119',
              title:
                'Long restaurant names overflow the order card on small screens and push the price outside the card',
              labelIds: ['l103'],
            },
          ],
        },
        {
          id: 'g105',
          title: 'Ready for Production',
          style: {},
          tasks: [
            {
              id: 'c120',
              title: 'Login page',
              labelIds: ['l101'],
              memberIds: ['u104'],
            },
            {
              id: 'c121',
              title: 'App header and navigation',
              labelIds: ['l101'],
              memberIds: ['u103'],
            },
          ],
        },
        {
          id: 'g106',
          title: 'Done',
          style: {},
          tasks: [
            {
              id: 'c122',
              title: 'Data model',
              labelIds: ['l102'],
              memberIds: ['u101', 'u102'],
              dueDate: '2026-11-12',
              checklists: [
                {
                  id: 'cl103',
                  title: 'Collections',
                  todos: [
                    { id: 'td108', title: 'users', isDone: true },
                    { id: 'td109', title: 'classes', isDone: true },
                    { id: 'td110', title: 'orders', isDone: true },
                  ],
                },
              ],
            },
            {
              id: 'c123',
              title: 'Wireframes',
              labelIds: ['l104'],
              memberIds: ['u103'],
              dueDate: '2026-11-10',
            },
            { id: 'c124', title: 'Repo setup', memberIds: ['u102'] },
            {
              id: 'c125',
              title: 'Kickoff with office manager',
              memberIds: ['u101', 'u102', 'u103', 'u104', 'u105'],
              style: { backgroundColor: '#4bce97' },
            },
          ],
        },
      ],
      activities: [
        {
          id: 'a101',
          txt: 'moved Wireframes to Done',
          createdAt: 1763100000000,
          byMember: shira,
          group: { id: 'g106', title: 'Done' },
          task: { id: 'c123', title: 'Wireframes' },
        },
        {
          id: 'a102',
          txt: 'added Orders after 11:00 still accepted to QA',
          createdAt: 1763600000000,
          byMember: maya,
          group: { id: 'g104', title: 'QA' },
          task: { id: 'c118', title: 'Orders after 11:00 still accepted' },
        },
        {
          id: 'a103',
          txt: 'completed Notes field on Lunch order form',
          createdAt: 1763700000000,
          byMember: lior,
          group: { id: 'g103', title: 'In Development' },
          task: { id: 'c114', title: 'Lunch order form' },
        },
      ],
    },
    {
      _id: 'b102',
      title: 'Wellness Program',
      isStarred: true,
      createdBy: maya,
      style: { backgroundImage: '' },
      labels: [],
      members: [maya, shira],
      groups: [
        {
          id: 'g201',
          title: 'Ideas',
          style: {},
          tasks: [
            { id: 'c201', title: 'Pilates on Mondays' },
            { id: 'c202', title: 'Meditation session' },
            { id: 'c203', title: 'Running group' },
          ],
        },
        {
          id: 'g202',
          title: 'Planned',
          style: {},
          tasks: [
            {
              id: 'c204',
              title: 'Yoga - Sunday and Wednesday 12:30',
              memberIds: ['u101'],
            },
            {
              id: 'c205',
              title: 'Find a second instructor',
              dueDate: '2026-12-01',
            },
          ],
        },
      ],
      activities: [],
    },
    {
      _id: 'b103',
      title: 'Office Events',
      isStarred: false,
      createdBy: maya,
      style: { backgroundImage: '' },
      labels: [],
      members: [maya],
      groups: [
        {
          id: 'g301',
          title: 'Upcoming',
          style: {},
          tasks: [
            { id: 'c301', title: 'End of year party', dueDate: '2026-12-24' },
            { id: 'c302', title: 'Hanukkah lunch', dueDate: '2026-12-15' },
          ],
        },
        {
          id: 'g302',
          title: 'Done',
          style: {},
          tasks: [{ id: 'c303', title: 'Team breakfast' }],
        },
      ],
      activities: [],
    },
    {
      _id: 'b104',
      title: 'Onboarding',
      isStarred: false,
      createdBy: maya,
      style: { backgroundImage: '' },
      labels: [],
      members: [maya, omer],
      groups: [
        {
          id: 'g401',
          title: 'First day',
          style: {},
          tasks: [
            { id: 'c401', title: 'Laptop and accounts' },
            { id: 'c402', title: 'Office tour' },
            { id: 'c403', title: 'Lunch with the team' },
          ],
        },
        {
          id: 'g402',
          title: 'First week',
          style: {},
          tasks: [{ id: 'c404', title: 'Meet with team lead' }],
        },
      ],
      activities: [],
    },
    {
      _id: 'b105',
      title: 'IT Requests',
      isStarred: false,
      createdBy: omer,
      style: { backgroundImage: '' },
      labels: [],
      members: [omer],
      groups: [
        {
          id: 'g501',
          title: 'Open',
          style: {},
          tasks: [
            { id: 'c501', title: 'Printer on 3rd floor not working' },
            { id: 'c502', title: 'New monitor for Daniel' },
          ],
        },
        { id: 'g502', title: 'Closed', style: {}, tasks: [] },
      ],
      activities: [],
    },
  ]
  saveToStorage(STORAGE_KEY, boards)
}
