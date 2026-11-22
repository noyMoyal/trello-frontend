import PropTypes from 'prop-types'
export function BoardFilter({ filterBy, setFilterBy }) {
  function onSetSort(ev) {
    const sortDir = +ev.target.value
    setFilterBy({ ...filterBy, sortField: sortDir ? 'title' : '', sortDir })
  }

  return (
    <div className="board-filter">
      <label className="board-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" />
        </svg>
        <input type="search" name="txt" aria-label="Search boards" value={filterBy.txt}
          placeholder="Search your boards" onChange={ev => setFilterBy({ ...filterBy, txt: ev.target.value })} />
      </label>
      <label className="board-sort">
        <span>Sort by</span>
        <select value={filterBy.sortField ? filterBy.sortDir : 0} onChange={onSetSort}>
          <option value="0">Default order</option>
          <option value="1">Name (A–Z)</option>
          <option value="-1">Name (Z–A)</option>
        </select>
      </label>
    </div>
  )
}

BoardFilter.propTypes = {
  filterBy: PropTypes.shape({ txt: PropTypes.string.isRequired, sortField: PropTypes.string, sortDir: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }).isRequired,
  setFilterBy: PropTypes.func.isRequired,
}
