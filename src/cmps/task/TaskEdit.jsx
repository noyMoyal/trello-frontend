
import { useState } from 'react'
import {
    Users, Tag, CalendarDays, CheckSquare,
    Paperclip, AlignLeft, Activity, X, CreditCard,
    Trash2
} from 'lucide-react'

export function TaskEdit({ task, board, onSave, onClose }) {
    const [editedTask, setEditedTask] = useState({ ...task })
    const [isLabelsOpen, setIsLabelsOpen] = useState(false)
    const [isMembersOpen, setIsMembersOpen] = useState(false)
    const [isDatesOpen, setIsDatesOpen] = useState(false)
    const [isChecklistOpen, setIsChecklistOpen] = useState(false)
    const [newTodoTitles, setNewTodoTitles] = useState({})

    function handleChange({ target }) {
        const { name, value } = target
        setEditedTask(prev => ({ ...prev, [name]: value }))
    }

    function toggleMember(memberId) {
        setEditedTask(prev => {
            const memberIds = prev.memberIds || []
            return {
                ...prev,
                memberIds: memberIds.includes(memberId)
                    ? memberIds.filter(id => id !== memberId)
                    : [...memberIds, memberId]
            }
        })
    }

    function toggleLabel(labelId) {
        setEditedTask(prev => {
            const labelIds = prev.labelIds || []
            return {
                ...prev,
                labelIds: labelIds.includes(labelId)
                    ? labelIds.filter(id => id !== labelId)
                    : [...labelIds, labelId]
            }
        })
    }

    function removeDueDate() {
        setEditedTask(prev => ({ ...prev, dueDate: '' }))
    }

    function addChecklist() {
        const checklist = {
            id: 'cl' + Date.now(),
            title: 'Checklist',
            todos: []
        }

        setEditedTask(prev => ({
            ...prev,
            checklists: [...(prev.checklists || []), checklist]
        }))
        setIsChecklistOpen(false)
    }

    function updateChecklistTitle(checklistId, title) {
        setEditedTask(prev => ({
            ...prev,
            checklists: (prev.checklists || []).map(checklist =>
                checklist.id === checklistId
                    ? { ...checklist, title }
                    : checklist
            )
        }))
    }

    function removeChecklist(checklistId) {
        if (!window.confirm('Delete this checklist?')) return

        setEditedTask(prev => ({
            ...prev,
            checklists: (prev.checklists || []).filter(
                checklist => checklist.id !== checklistId
            )
        }))
    }

    function addTodo(checklistId) {
        const title = (newTodoTitles[checklistId] || '').trim()
        if (!title) return

        const todo = {
            id: 'todo' + Date.now(),
            title,
            isDone: false
        }

        setEditedTask(prev => ({
            ...prev,
            checklists: (prev.checklists || []).map(checklist =>
                checklist.id === checklistId
                    ? {
                        ...checklist,
                        todos: [...(checklist.todos || []), todo]
                    }
                    : checklist
            )
        }))

        setNewTodoTitles(prev => ({
            ...prev,
            [checklistId]: ''
        }))
    }

    function toggleTodo(checklistId, todoId) {
        setEditedTask(prev => ({
            ...prev,
            checklists: (prev.checklists || []).map(checklist =>
                checklist.id === checklistId
                    ? {
                        ...checklist,
                        todos: (checklist.todos || []).map(todo =>
                            todo.id === todoId
                                ? { ...todo, isDone: !todo.isDone }
                                : todo
                        )
                    }
                    : checklist
            )
        }))
    }

    function removeTodo(checklistId, todoId) {
        setEditedTask(prev => ({
            ...prev,
            checklists: (prev.checklists || []).map(checklist =>
                checklist.id === checklistId
                    ? {
                        ...checklist,
                        todos: (checklist.todos || []).filter(
                            todo => todo.id !== todoId
                        )
                    }
                    : checklist
            )
        }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onSave(editedTask)
    }

    return (
        <div className="task-edit-overlay" onClick={onClose}>
            <section
                className="task-edit"
                role="dialog"
                aria-modal="true"
                aria-label="Edit card"
                onClick={ev => ev.stopPropagation()}
            >
                <button
                    type="button"
                    className="task-edit-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <form onSubmit={handleSubmit}>
                    <header className="task-edit-header">
                        <CreditCard size={24} />
                        <input
                            name="title"
                            value={editedTask.title || ''}
                            onChange={handleChange}
                            placeholder="Card title"
                            required
                        />
                    </header>

                    <div className="task-edit-content">
                        <main className="task-edit-main">

                            {editedTask.memberIds?.length > 0 && (
                                <div className="task-edit-labels">
                                    <h4>Members</h4>
                                    <div className="task-label-list">
                                        {(board?.members || [])
                                            .filter(member =>
                                                editedTask.memberIds.includes(member._id)
                                            )
                                            .map(member => (
                                                <span
                                                    key={member._id}
                                                    className="task-member-avatar"
                                                    title={member.fullname}
                                                >
                                                    {member.fullname
                                                        ?.split(' ')
                                                        .filter(Boolean)
                                                        .map(word => word[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {editedTask.labelIds?.length > 0 && (
                                <div className="task-edit-labels">
                                    <h4>Labels</h4>
                                    <div className="task-label-list">
                                        {(board?.labels || [])
                                            .filter(label =>
                                                editedTask.labelIds.includes(label.id)
                                            )
                                            .map(label => (
                                                <span
                                                    key={label.id}
                                                    className="task-label"
                                                    style={{
                                                        backgroundColor: label.color
                                                    }}
                                                >
                                                    {label.title}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {editedTask.dueDate && (
                                <div className="task-edit-labels">
                                    <h4>Due date</h4>
                                    <span className="task-due-date">
                                        <CalendarDays size={16} />
                                        {editedTask.dueDate}
                                    </span>
                                </div>
                            )}

                            <h3>
                                <AlignLeft size={20} />
                                Description
                            </h3>

                            <textarea
                                name="description"
                                value={editedTask.description || ''}
                                onChange={handleChange}
                                placeholder="Add a more detailed description..."
                            />

                            <div className="task-edit-actions">
                                <button type="submit">Save</button>
                                <button type="button" onClick={onClose}>
                                    Cancel
                                </button>
                            </div>

                            {(editedTask.checklists || []).map(checklist => {
                                const todos = checklist.todos || []
                                const doneCount = todos.filter(todo => todo.isDone).length
                                const progress = todos.length
                                    ? Math.round(doneCount / todos.length * 100)
                                    : 0

                                return (
                                    <div
                                        key={checklist.id}
                                        className="task-checklist"
                                    >
                                        <div className="task-checklist-header">
                                            <CheckSquare size={20} />

                                            <input
                                                type="text"
                                                value={checklist.title}
                                                onChange={ev =>
                                                    updateChecklistTitle(
                                                        checklist.id,
                                                        ev.target.value
                                                    )
                                                }
                                                aria-label="Checklist title"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeChecklist(checklist.id)
                                                }
                                                title="Delete checklist"
                                                aria-label="Delete checklist"
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>

                                        <p>{progress}% completed</p>
                                        <progress value={progress} max="100" />

                                        {todos.map(todo => (
                                            <div
                                                key={todo.id}
                                                className="task-checklist-todo"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={todo.isDone}
                                                    onChange={() =>
                                                        toggleTodo(checklist.id, todo.id)
                                                    }
                                                />

                                                <span
                                                    style={{
                                                        textDecoration: todo.isDone
                                                            ? 'line-through'
                                                            : 'none'
                                                    }}
                                                >
                                                    {todo.title}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTodo(checklist.id, todo.id)
                                                    }
                                                    title="Delete item"
                                                    aria-label="Delete item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="task-checklist-add">
                                            <input
                                                type="text"
                                                placeholder="Add an item..."
                                                value={newTodoTitles[checklist.id] || ''}
                                                onChange={ev =>
                                                    setNewTodoTitles(prev => ({
                                                        ...prev,
                                                        [checklist.id]: ev.target.value
                                                    }))
                                                }
                                            />

                                            <button
                                                type="button"
                                                onClick={() => addTodo(checklist.id)}
                                            >
                                                Add item
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}

                            <h3>
                                <Activity size={20} />
                                Activity
                            </h3>

                            <p className="task-edit-activity">
                                No activity yet
                            </p>
                        </main>

                        <aside className="task-edit-sidebar">
                            <h4>Add to card</h4>

                            <button
                                type="button"
                                onClick={() => setIsMembersOpen(prev => !prev)}
                            >
                                <Users size={16} />
                                Members
                            </button>

                            {isMembersOpen && (
                                <div className="task-label-picker">
                                    <h4>Members</h4>
                                    {(board?.members || []).map(member => (
                                        <label
                                            key={member._id}
                                            className="task-label-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(editedTask.memberIds || [])
                                                    .includes(member._id)}
                                                onChange={() =>
                                                    toggleMember(member._id)
                                                }
                                            />
                                            <span className="task-member-name">
                                                {member.fullname}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsLabelsOpen(prev => !prev)}
                            >
                                <Tag size={16} />
                                Labels
                            </button>

                            {isLabelsOpen && (
                                <div className="task-label-picker">
                                    <h4>Labels</h4>
                                    {(board?.labels || []).map(label => (
                                        <label
                                            key={label.id}
                                            className="task-label-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(editedTask.labelIds || [])
                                                    .includes(label.id)}
                                                onChange={() =>
                                                    toggleLabel(label.id)
                                                }
                                            />
                                            <span
                                                style={{
                                                    backgroundColor: label.color
                                                }}
                                            >
                                                {label.title}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsDatesOpen(prev => !prev)}
                            >
                                <CalendarDays size={16} />
                                Dates
                            </button>

                            {isDatesOpen && (
                                <div className="task-label-picker">
                                    <h4>Due date</h4>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={editedTask.dueDate || ''}
                                        onChange={handleChange}
                                        className="task-date-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeDueDate}
                                    >
                                        Remove date
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsChecklistOpen(prev => !prev)}
                            >
                                <CheckSquare size={16} />
                                Checklist
                            </button>

                            {isChecklistOpen && (
                                <div className="task-label-picker">
                                    <h4>Add checklist</h4>
                                    <button
                                        type="button"
                                        onClick={addChecklist}
                                    >
                                        Add
                                    </button>
                                </div>
                            )}

                            <button type="button" disabled>
                                <Paperclip size={16} />
                                Attachment
                            </button>
                        </aside>
                    </div>
                </form>
            </section>
        </div>
    )
}



