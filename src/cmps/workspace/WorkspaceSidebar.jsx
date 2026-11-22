import PropTypes from 'prop-types'
export function WorkspaceSidebar({ view, onSetView, onCreateBoard }) {
  return (
    <aside className="workspace-sidebar" aria-label="Workspace navigation">
      <div className="sidebar-workspace">
        <span className="workspace-avatar" aria-hidden="true">W</span>
        <div><strong>Workspace</strong><span>Free plan</span></div>
      </div>
      <nav className="workspace-nav" aria-label="Board views">
        <button className={view === 'all' ? 'is-active' : ''} aria-pressed={view === 'all'} onClick={() => onSetView('all')}>
          <span aria-hidden="true">▦</span> Boards
        </button>
        <button className={view === 'starred' ? 'is-active' : ''} aria-pressed={view === 'starred'} onClick={() => onSetView('starred')}>
          <span aria-hidden="true">☆</span> Starred boards
        </button>
      </nav>
      <div className="sidebar-boards">
        <span>YOUR WORKSPACE</span>
        <button onClick={onCreateBoard}><span aria-hidden="true">＋</span> Create a board</button>
      </div>
      <p className="sidebar-note">Ideas, plans, and everything<br />in between. All in one place.</p>
    </aside>
  )
}

WorkspaceSidebar.propTypes = {
  view: PropTypes.string.isRequired,
  onSetView: PropTypes.func.isRequired,
  onCreateBoard: PropTypes.func.isRequired,
}
