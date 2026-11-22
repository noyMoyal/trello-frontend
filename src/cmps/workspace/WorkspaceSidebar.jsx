export function WorkspaceSidebar() {
  return (
    <aside className="workspace-sidebar" aria-label="Workspace navigation">
      <div className="sidebar-workspace">
        <span className="workspace-avatar" aria-hidden="true">W</span>
        <div><strong>Workspace</strong><span>Free plan</span></div>
      </div>
      <nav className="workspace-nav" aria-label="Board views">
        <button className="is-active" aria-pressed="true">
          <span aria-hidden="true">▦</span> Boards
        </button>
      </nav>
      <p className="sidebar-note">Ideas, plans, and everything<br />in between. All in one place.</p>
    </aside>
  )
}
