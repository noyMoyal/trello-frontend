import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Folder, Plus, Star } from 'lucide-react'

import { loadBoards, addBoard, updateBoard, removeBoard } from '../store/actions/board.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board/'

import { BoardList } from '../cmps/BoardList'
import { BoardFilter } from '../cmps/BoardFilter'
import { BoardEdit } from '../cmps/workspace/BoardEdit'
import { BoardRemove } from '../cmps/workspace/BoardRemove'
import { WorkspaceSidebar } from '../cmps/workspace/WorkspaceSidebar'

export function BoardIndex({ theme, onToggleTheme }) {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const [view, setView] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [boardToEdit, setBoardToEdit] = useState(null)
  const [boardToRemove, setBoardToRemove] = useState(null)
  const [pendingIds, setPendingIds] = useState([])
  const pendingBoards = useRef(new Set())
  const dialogTrigger = useRef(null)
  const workspaceRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setLoadError('')
    loadBoards()
      .catch(() => {
        if (isActive) setLoadError('We couldn’t load your boards. Please try again.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })
    return () => { isActive = false }
  }, [retryCount])

  const filteredBoards = boards.filter(board =>
    board.title.toLowerCase().includes(filterBy.txt.trim().toLowerCase()),
  )
  if (filterBy.sortField === 'title') {
    filteredBoards.sort((a, b) => a.title.localeCompare(b.title) * filterBy.sortDir)
  }
  const starredBoards = filteredBoards.filter(board => board.isStarred)

  async function onSaveBoard(changes) {
    if (boardToEdit._id) {
      const board = await boardService.getById(boardToEdit._id)
      await updateBoard({ ...board, title: changes.title, style: changes.style })
      onCloseDialog()
      showSuccessMsg('Board updated')
    } else {
      const board = await addBoard({ ...boardService.getEmptyBoard(), ...changes })
      onCloseDialog()
      showSuccessMsg('Board created')
      navigate(`/board/${board._id}`)
    }
  }

  async function onToggleStar(boardPreview) {
    if (pendingBoards.current.has(boardPreview._id)) return
    pendingBoards.current.add(boardPreview._id)
    setPendingIds([...pendingBoards.current])
    try {
      const board = await boardService.getById(boardPreview._id)
      await updateBoard({ ...board, isStarred: !board.isStarred })
    } catch (err) {
      showErrorMsg('Cannot update favorite boards')
    } finally {
      pendingBoards.current.delete(boardPreview._id)
      setPendingIds([...pendingBoards.current])
    }
  }

  async function onRemoveBoard() {
    await removeBoard(boardToRemove._id)
    onCloseDialog()
    showSuccessMsg('Board deleted')
  }

  function onCreateBoard() {
    dialogTrigger.current = document.activeElement
    setBoardToEdit(boardService.getEmptyBoard())
  }

  function onEditBoard(board) {
    dialogTrigger.current = document.activeElement
    setBoardToEdit(board)
  }

  function onRequestRemove(board) {
    dialogTrigger.current = document.activeElement
    setBoardToRemove(board)
  }

  function onCloseDialog() {
    setBoardToEdit(null)
    setBoardToRemove(null)
    requestAnimationFrame(() => {
      const trigger = dialogTrigger.current
      if (trigger?.isConnected) trigger.focus()
      else workspaceRef.current?.querySelector('.workspace-heading button')?.focus()
    })
  }

  const listProps = {
    onToggleStar,
    onUpdateBoard: onEditBoard,
    onRemoveBoard: onRequestRemove,
    pendingIds,
  }

  return (
    <section className="board-index" ref={workspaceRef}>
      <WorkspaceSidebar view={view} onSetView={setView} onCreateBoard={onCreateBoard}
        boardCount={boards.length} starredCount={boards.filter(board => board.isStarred).length}
        theme={theme} onToggleTheme={onToggleTheme} />
      <div className="workspace-content">
        <header className="workspace-heading">
          <div>
            <p className="workspace-eyebrow">YOUR PROJECTS</p>
            <h1>Workspace</h1>
            <p className="workspace-summary">{boards.length} {boards.length === 1 ? 'board' : 'boards'}<span aria-hidden="true"> · </span>{boards.filter(board => board.isStarred).length} starred</p>
          </div>
          <button className="workspace-primary" onClick={onCreateBoard}>
            <Plus size={17} aria-hidden="true" /> Create board
          </button>
        </header>
        <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} />
        {isLoading ? (
          <div className="workspace-state" role="status">Loading your boards…</div>
        ) : loadError ? (
          <div className="workspace-state" role="alert">
            <h2>Something went wrong</h2>
            <p>{loadError}</p>
            <button className="workspace-primary" onClick={() => setRetryCount(count => count + 1)}>Try again</button>
          </div>
        ) : (
          <>
            {(view === 'starred' || starredBoards.length > 0) && (
              <section className="workspace-section" aria-labelledby="starred-heading">
                <div className="workspace-section-heading">
                  <h2 id="starred-heading"><Star size={19} className="heading-star" aria-hidden="true" /> Starred boards</h2>
                  <span className="board-count">{starredBoards.length}</span>
                </div>
                {starredBoards.length ? <BoardList boards={starredBoards} {...listProps} /> : (
                  <div className="workspace-empty">
                    <h3>{filterBy.txt.trim() ? 'No matching favorites' : 'No starred boards'}</h3>
                    <p>{filterBy.txt.trim() ? 'Try a different board name.' : 'Star a board and it will show up here.'}</p>
                  </div>
                )}
              </section>
            )}
            {view === 'all' && (
              <section className="workspace-section" aria-labelledby="boards-heading">
                <div className="workspace-section-heading">
                  <h2 id="boards-heading"><Folder size={19} aria-hidden="true" /> Your boards</h2>
                  <span className="board-count">{filteredBoards.length}</span>
                </div>
                {!boards.length ? (
                  <div className="workspace-empty">
                    <h3>No boards yet</h3>
                    <p>Create a board to get started.</p>
                    <button className="workspace-primary" onClick={onCreateBoard}>Create board</button>
                  </div>
                ) : !filteredBoards.length ? (
                  <div className="workspace-empty">
                    <h3>No boards found</h3>
                    <p>Try a different name or clear your search.</p>
                    <button className="workspace-secondary" onClick={() => setFilterBy({ ...filterBy, txt: '' })}>Clear search</button>
                  </div>
                ) : <BoardList boards={filteredBoards} onCreateBoard={onCreateBoard} {...listProps} />}
              </section>
            )}
          </>
        )}
      </div>
      {boardToEdit && <BoardEdit board={boardToEdit} onSaveBoard={onSaveBoard} onClose={onCloseDialog} />}
      {boardToRemove && <BoardRemove board={boardToRemove} onRemoveBoard={onRemoveBoard} onClose={onCloseDialog} />}
    </section>
  )
}

BoardIndex.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}
