import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards } from '../store/actions/board.actions'
import { boardService } from '../services/board/'

import { BoardList } from '../cmps/BoardList'
import { BoardFilter } from '../cmps/BoardFilter'
import { WorkspaceSidebar } from '../cmps/workspace/WorkspaceSidebar'

export function BoardIndex() {
  const boards = useSelector(storeState => storeState.boardModule.boards)
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

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

  return (
    <section className="board-index">
      <WorkspaceSidebar />
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
                ) : <BoardList boards={filteredBoards} />}
              </section>
          </>
        )}
      </div>
    </section>
  )
}
