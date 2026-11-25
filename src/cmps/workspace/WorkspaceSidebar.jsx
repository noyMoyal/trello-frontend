import PropTypes from 'prop-types'
import { Folder, LayoutGrid, Moon, Plus, Star, Sun } from 'lucide-react'

export function WorkspaceSidebar({ view, onSetView, onCreateBoard, boardCount, starredCount, theme, onToggleTheme }) {
  return (
    <aside className="workspace-sidebar" aria-label="Workspace navigation">
      <div className="sidebar-workspace">
        <span className="workspace-avatar" aria-hidden="true"><Folder size={19} /></span>
        <div><strong>Workspace</strong><span>Boards & favorites</span></div>
      </div>
      <nav className="workspace-nav" aria-label="Board views">
        <button className={view === 'all' ? 'is-active' : ''} aria-pressed={view === 'all'} onClick={() => onSetView('all')}>
          <LayoutGrid size={18} aria-hidden="true" /> Boards <span className="sidebar-count" aria-hidden="true">{boardCount}</span>
        </button>
        <button className={view === 'starred' ? 'is-active' : ''} aria-pressed={view === 'starred'} onClick={() => onSetView('starred')}>
          <Star size={18} aria-hidden="true" /> Starred boards <span className="sidebar-count" aria-hidden="true">{starredCount}</span>
        </button>
      </nav>
      <div className="sidebar-boards">
        <span>WORKSPACE</span>
        <button onClick={onCreateBoard}><Plus size={18} aria-hidden="true" /> Create a board</button>
      </div>
      <div className="sidebar-appearance">
        <button
          type="button"
          className="workspace-theme-toggle"
          aria-label="Dark mode"
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <Moon size={19} aria-hidden="true" /> : <Sun size={19} aria-hidden="true" />}
        </button>
      </div>
    </aside>
  )
}

WorkspaceSidebar.propTypes = {
  view: PropTypes.string.isRequired,
  onSetView: PropTypes.func.isRequired,
  onCreateBoard: PropTypes.func.isRequired,
  boardCount: PropTypes.number.isRequired,
  starredCount: PropTypes.number.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}
