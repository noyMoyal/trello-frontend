import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards, updateBoard } from '../store/actions/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board/'

import { BoardList } from '../cmps/BoardList'
import { BoardFilter } from '../cmps/BoardFilter'
import { WorkspaceSidebar } from '../cmps/workspace/WorkspaceSidebar'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const [view, setView] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [pendingIds, setPendingIds] = useState([])
  const pendingBoards = useRef(new Set())

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

  const listProps = {
    onToggleStar,
    pendingIds,
  }

  return (
    <section className="board-index">
      <WorkspaceSidebar view={view} onSetView={setView} />
      <div className="workspace-content">
        <header className="workspace-heading">
          <div className="workspace-avatar" aria-hidden="true">W</div>
          <div>
            <p className="workspace-eyebrow">YOUR WORKSPACE</p>
            <h1>Workspace</h1>
            <p>A little space for your next big idea.</p>
          </div>
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
                  <h2 id="starred-heading"><span className="heading-star" aria-hidden="true">☆</span> Starred boards</h2>
                  <span className="board-count">{starredBoards.length}</span>
                </div>
                {starredBoards.length ? <BoardList boards={starredBoards} {...listProps} /> : (
                  <div className="workspace-empty">
                    <h3>{filterBy.txt.trim() ? 'No matching favorites' : 'Keep your favorites close'}</h3>
                    <p>{filterBy.txt.trim() ? 'Try a different board name.' : 'Star a board and it will show up here.'}</p>
                  </div>
                )}
              </section>
            )}
            {view === 'all' && (
              <section className="workspace-section" aria-labelledby="boards-heading">
                <div className="workspace-section-heading">
                  <h2 id="boards-heading"><span aria-hidden="true">▦</span> Your boards</h2>
                  <span className="board-count">{filteredBoards.length}</span>
                </div>
                {!boards.length ? (
                  <div className="workspace-empty">
                    <h3>Good things start with a board</h3>
                    <p>Your workspace boards will appear here.</p>
                  </div>
                ) : !filteredBoards.length ? (
                  <div className="workspace-empty">
                    <h3>No boards found</h3>
                    <p>Try a different name or clear your search.</p>
                    <button className="workspace-secondary" onClick={() => setFilterBy({ ...filterBy, txt: '' })}>Clear search</button>
                  </div>
                ) : <BoardList boards={filteredBoards} {...listProps} />}
              </section>
            )}
          </>
        )}
      </div>
    </section>
  )
}
