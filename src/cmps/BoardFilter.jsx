import PropTypes from 'prop-types'
import { Search } from 'lucide-react'
export function BoardFilter({ filterBy, setFilterBy }) {
  function onSetSort(ev) {
    const sortDir = +ev.target.value
    setFilterBy({ ...filterBy, sortField: sortDir ? 'title' : '', sortDir })
  }

  return (
    <div className="board-filter">
      <label className="board-search">
        <Search size={18} aria-hidden="true" />
        <input type="search" name="txt" aria-label="Search boards" value={filterBy.txt}
          placeholder="Find a board…" onChange={ev => setFilterBy({ ...filterBy, txt: ev.target.value })} />
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
