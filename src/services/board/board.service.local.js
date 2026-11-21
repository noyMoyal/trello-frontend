import { storageService } from '../async-storage.service'
import { makeId, loadFromStorage, saveToStorage } from '../util.service'
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
function _createBoards() {
  var boards = loadFromStorage(STORAGE_KEY)
  if (boards && boards.length > 0) return

  const noy = { _id: 'u101', fullname: 'Noy', imgUrl: '' }

  boards = [
    {
      _id: 'b101',
      title: 'Trello Project 🚀',
      isStarred: true,
      createdBy: noy,
      style: { backgroundImage: '' },
      labels: [
        { id: 'l101', title: 'Frontend', color: '#4bce97' },
        { id: 'l102', title: 'Backend', color: '#579dff' },
        { id: 'l103', title: 'Bug', color: '#f87168' },
        { id: 'l104', title: 'Design', color: '#9f8fef' },
        { id: 'l105', title: 'Urgent', color: '#fea362' },
        { id: 'l106', title: 'Research', color: '#f5cd47' },
      ],
      members: [
        noy,
        { _id: 'u102', fullname: 'Kobi', imgUrl: '' },
        { _id: 'u103', fullname: 'Hodaya', imgUrl: '' },
      ],
      groups: [
        {
          id: 'g101',
          title: 'Backlog-Server',
          style: {},
          tasks: [
            {
              id: 'c101',
              title: 'Get the Express server up and running',
              labelIds: ['l102'],
              memberIds: ['u102'],
            },
            {
              id: 'c102',
              title: 'Board API - get, add, update, delete',
              labelIds: ['l102'],
            },
            {
              id: 'c103',
              title: 'Move everything from localStorage to MongoDB',
              description: 'Atlas or local? Ask Kosta before we start',
              labelIds: ['l102'],
              dueDate: '2026-12-03',
            },
            {
              id: 'c104',
              title: 'Login & signup (but keep guests working!)',
              labelIds: ['l102', 'l105'],
            },
            {
              id: 'c120',
              title: 'Save a single task without sending the whole board',
              labelIds: ['l102'],
            },
            {
              id: 'c121',
              title: 'Live updates with sockets - nice to have',
              labelIds: ['l102', 'l106'],
            },
            {
              id: 'c122',
              title: 'Push new activities from the server',
              labelIds: ['l102'],
            },
            {
              id: 'c123',
              title: 'Deploy so we can send a link 🌐',
              labelIds: ['l102'],
              dueDate: '2026-12-10',
            },
          ],
        },
        {
          id: 'g102',
          title: 'Backlog-Client',
          style: {},
          tasks: [
            {
              id: 'c105',
              title: 'Board header - title, star and members',
              labelIds: ['l101'],
              memberIds: ['u102'],
            },
            {
              id: 'c106',
              title: 'Open a card and edit it',
              description:
                'Title, description, labels, members, due date. Start as a separate route, modal later.',
              labelIds: ['l101'],
              memberIds: ['u103'],
            },
            {
              id: 'c107',
              title: 'Pick labels for a card',
              labelIds: ['l101', 'l104'],
            },
            { id: 'c108', title: 'Add people to a card', labelIds: ['l101'] },
            {
              id: 'c109',
              title: 'Due dates with a little calendar',
              labelIds: ['l101'],
            },
            {
              id: 'c110',
              title: 'Make the home page look nice ✨',
              labelIds: ['l104'],
              style: { backgroundColor: '#9f8fef' },
            },
            { id: 'c124', title: 'Search boards by name', labelIds: ['l101'] },
            {
              id: 'c125',
              title: 'Star your favorite boards ⭐',
              labelIds: ['l101'],
            },
            {
              id: 'c126',
              title: 'Let users change the board background',
              labelIds: ['l101', 'l104'],
            },
            {
              id: 'c127',
              title: 'Add a new list to the board',
              labelIds: ['l101'],
            },
            {
              id: 'c128',
              title: 'Check how it all looks on a phone 📱',
              labelIds: ['l104'],
              style: { backgroundColor: '#579dff' },
            },
          ],
        },
        {
          id: 'g103',
          title: 'In Development',
          style: {},
          tasks: [
            {
              id: 'c111',
              title: 'Board page - the heart of the app ❤️',
              description:
                'Lists side by side, cards inside each list. No drag & drop yet.',
              dueDate: '2026-11-26',
              labelIds: ['l101', 'l105'],
              memberIds: ['u101'],
              checklists: [
                {
                  id: 'cl101',
                  title: 'What we need',
                  todos: [
                    { id: 'td101', title: 'Board details page', isDone: false },
                    { id: 'td102', title: 'Lists side by side', isDone: false },
                    {
                      id: 'td103',
                      title: 'Cards inside each list',
                      isDone: false,
                    },
                    {
                      id: 'td104',
                      title: 'A nice small card preview',
                      isDone: false,
                    },
                  ],
                },
              ],
            },
            {
              id: 'c112',
              title: 'Fill the app with demo boards',
              labelIds: ['l101'],
              memberIds: ['u101'],
            },
            {
              id: 'c129',
              title: 'Show all the lists of a board',
              labelIds: ['l101'],
              memberIds: ['u101'],
            },
            {
              id: 'c130',
              title: 'Card preview with labels and avatars',
              labelIds: ['l101'],
              memberIds: ['u101'],
              dueDate: '2026-11-25',
            },
          ],
        },
        {
          id: 'g104',
          title: 'QA',
          style: {},
          tasks: [
            {
              id: 'c113',
              title: 'Board list looks weird on mobile',
              labelIds: ['l103'],
              memberIds: ['u103'],
            },
            {
              id: 'c114',
              title: "Clear button doesn't clear the search",
              labelIds: ['l103'],
            },
            {
              id: 'c131',
              title: 'What happens with an empty list?',
              labelIds: ['l103'],
            },
            {
              id: 'c132',
              title:
                'Really long card titles break the layout - try this one and see what happens to it',
              labelIds: ['l103', 'l105'],
              memberIds: ['u103'],
            },
          ],
        },
        {
          id: 'g105',
          title: 'Ready for Production',
          style: {},
          tasks: [
            {
              id: 'c115',
              title: 'Boards page',
              labelIds: ['l101'],
              memberIds: ['u101'],
            },
            {
              id: 'c133',
              title: 'Login page',
              labelIds: ['l101'],
              memberIds: ['u102'],
            },
            {
              id: 'c134',
              title: 'Top header with the logo',
              labelIds: ['l101'],
              memberIds: ['u102'],
            },
          ],
        },
        {
          id: 'g106',
          title: 'Done 🎉',
          style: {},
          tasks: [
            { id: 'c116', title: 'Clean up the starter', memberIds: ['u101'] },
            {
              id: 'c117',
              title: 'Open a GitHub repo and invite everyone',
              memberIds: ['u101'],
            },
            {
              id: 'c118',
              title: 'Rename cars to boards everywhere',
              memberIds: ['u101'],
            },
            {
              id: 'c119',
              title: 'Agree on the data model',
              labelIds: ['l106'],
              memberIds: ['u101', 'u102', 'u103'],
            },
            {
              id: 'c135',
              title: 'Read the kickoff summary',
              labelIds: ['l106'],
              memberIds: ['u101'],
            },
            {
              id: 'c136',
              title: 'Product approval meeting with Kosta',
              memberIds: ['u101', 'u102', 'u103'],
            },
          ],
        },
      ],
      activities: [
        {
          id: 'a101',
          txt: 'added Fill the app with demo boards to In Development',
          createdAt: 1763700000000,
          byMember: noy,
          group: { id: 'g103', title: 'In Development' },
          task: { id: 'c112', title: 'Fill the app with demo boards' },
        },
        {
          id: 'a102',
          txt: 'moved Open a GitHub repo and invite everyone to Done',
          createdAt: 1763600000000,
          byMember: noy,
          group: { id: 'g106', title: 'Done 🎉' },
          task: { id: 'c117', title: 'Open a GitHub repo and invite everyone' },
        },
      ],
    },
    {
      _id: 'b102',
      title: 'Home Stuff',
      isStarred: false,
      createdBy: noy,
      style: { backgroundImage: '' },
      labels: [{ id: 'l201', title: "Don't forget!", color: '#f87168' }],
      members: [noy],
      groups: [
        {
          id: 'g201',
          title: 'Grocery list 🛒',
          style: {},
          tasks: [
            { id: 'c201', title: 'Milk (the 3% one)' },
            { id: 'c202', title: 'Fresh bread' },
            {
              id: 'c203',
              title: "Coffee - we're almost out!",
              labelIds: ['l201'],
            },
            { id: 'c204', title: 'A dozen eggs' },
            { id: 'c205', title: 'Cherry tomatoes' },
            { id: 'c206', title: 'Olive oil' },
          ],
        },
        {
          id: 'g202',
          title: 'This week',
          style: {},
          tasks: [
            { id: 'c207', title: 'Do the laundry' },
            { id: 'c208', title: 'Dishes before bed' },
            { id: 'c209', title: 'Vacuum the living room' },
            { id: 'c210', title: 'Water the plants 🌱' },
            { id: 'c211', title: 'Take out the recycling on Thursday' },
          ],
        },
        {
          id: 'g203',
          title: 'Bills to pay',
          style: {},
          tasks: [
            {
              id: 'c212',
              title: 'Electricity bill',
              labelIds: ['l201'],
              dueDate: '2026-11-30',
            },
            { id: 'c213', title: 'Internet', dueDate: '2026-12-05' },
            { id: 'c214', title: 'City tax', dueDate: '2026-12-15' },
          ],
        },
        {
          id: 'g204',
          title: 'Done',
          style: {},
          tasks: [
            { id: 'c215', title: 'Fix the bathroom light - finally!' },
            { id: 'c216', title: 'Clean out the fridge' },
          ],
        },
      ],
      activities: [],
    },
    {
      _id: 'b103',
      title: 'Summer Vacation ☀️',
      isStarred: true,
      createdBy: noy,
      style: { backgroundImage: '' },
      labels: [],
      members: [noy],
      groups: [
        {
          id: 'g301',
          title: 'Where should we go?',
          style: {},
          tasks: [
            { id: 'c301', title: 'Eilat for a long weekend' },
            { id: 'c302', title: 'Greek islands 🏝️' },
            { id: 'c303', title: 'Rome - pasta and museums' },
            { id: 'c304', title: 'A hike up north in the Galilee' },
            { id: 'c305', title: 'Spa day at the Dead Sea' },
          ],
        },
        {
          id: 'g302',
          title: 'Need to book',
          style: {},
          tasks: [
            {
              id: 'c306',
              title: 'Flights - check prices again',
              dueDate: '2026-12-01',
            },
            { id: 'c307', title: 'Find a hotel near the beach' },
            { id: 'c308', title: 'Rent a car' },
            { id: 'c309', title: 'Travel insurance' },
          ],
        },
        {
          id: 'g303',
          title: 'Packing',
          style: {},
          tasks: [
            {
              id: 'c310',
              title: "Don't leave without these",
              checklists: [
                {
                  id: 'cl301',
                  title: 'Bag',
                  todos: [
                    { id: 'td301', title: 'Passport', isDone: true },
                    { id: 'td302', title: 'Sunscreen', isDone: false },
                    { id: 'td303', title: 'Phone charger', isDone: false },
                    { id: 'td304', title: 'Swimsuit', isDone: false },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'g304',
          title: 'Booked ✅',
          style: {},
          tasks: [{ id: 'c311', title: 'Concert tickets for Saturday night' }],
        },
      ],
      activities: [],
    },
    {
      _id: 'b104',
      title: 'Bootcamp Homework',
      isStarred: false,
      createdBy: noy,
      style: { backgroundImage: '' },
      labels: [],
      members: [noy],
      groups: [
        {
          id: 'g401',
          title: 'Still to do',
          style: {},
          tasks: [
            { id: 'c401', title: 'Finish Mister Toy part 4' },
            { id: 'c402', title: 'Go through the CSS Grid exercises' },
            { id: 'c403', title: 'Review the Redux summaries again' },
            { id: 'c404', title: 'Try the Mongo aggregation exercise' },
          ],
        },
        {
          id: 'g402',
          title: 'Working on it',
          style: {},
          tasks: [
            {
              id: 'c405',
              title: 'Final project - Trello clone 💪',
              dueDate: '2026-12-17',
            },
          ],
        },
        {
          id: 'g403',
          title: 'Submitted',
          style: {},
          tasks: [
            { id: 'c406', title: 'Appsus - mail and notes' },
            { id: 'c407', title: 'Miss Bug' },
            { id: 'c408', title: 'Mister Toy parts 1-3' },
            { id: 'c409', title: 'Place Keeper' },
            { id: 'c410', title: 'Travel Tip' },
          ],
        },
      ],
      activities: [],
    },
    {
      _id: 'b105',
      title: 'Job Hunt',
      isStarred: false,
      createdBy: noy,
      style: { backgroundImage: '' },
      labels: [],
      members: [noy],
      groups: [
        {
          id: 'g501',
          title: 'Get ready',
          style: {},
          tasks: [
            { id: 'c501', title: 'Update my CV with the final project' },
            { id: 'c502', title: 'Refresh my LinkedIn profile' },
            { id: 'c503', title: 'Build a small portfolio site' },
            { id: 'c504', title: 'Write a good README for GitHub' },
          ],
        },
        {
          id: 'g502',
          title: 'Sent my CV',
          style: {},
          tasks: [
            { id: 'c505', title: 'Frontend developer at a startup' },
            { id: 'c506', title: 'Junior fullstack position' },
          ],
        },
        {
          id: 'g503',
          title: 'Interviews',
          style: {},
          tasks: [
            { id: 'c507', title: 'Practice JavaScript interview questions' },
            { id: 'c508', title: 'Be ready to explain my Trello project' },
          ],
        },
        { id: 'g504', title: 'Offers 🤞', style: {}, tasks: [] },
      ],
      activities: [],
    },
  ]
  saveToStorage(STORAGE_KEY, boards)
}
