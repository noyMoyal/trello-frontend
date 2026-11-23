
import { useState } from 'react'
import {
    Users, Tag, CalendarDays, CheckSquare,
    Paperclip, AlignLeft, Activity, X, CreditCard
} from 'lucide-react'

export function TaskEdit({ task, board, onSave, onClose }) {
    const [editedTask, setEditedTask] = useState({ ...task })
    const [isLabelsOpen, setIsLabelsOpen] = useState(false)
    const [isMembersOpen, setIsMembersOpen] = useState(false)
    const [isDatesOpen, setIsDatesOpen] = useState(false)

    function handleChange({ target }) {
        const { name, value } = target
        setEditedTask(prev => ({
            ...prev,
            [name]: value
        }))
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

    function handleSubmit(ev) {
        ev.preventDefault()
        onSave(editedTask)
    }

    function removeDueDate() {
        setEditedTask(prev => ({
            ...prev,
            dueDate: ''
        }))
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
                                        {(board.members || [])
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
                                        {(board.labels || [])
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
                                onClick={() =>
                                    setIsMembersOpen(prev => !prev)
                                }
                            >
                                <Users size={16} />
                                Members
                            </button>

                            {isMembersOpen && (
                                <div className="task-label-picker">
                                    <h4>Members</h4>

                                    {(board.members || []).map(member => (
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
                                onClick={() =>
                                    setIsLabelsOpen(prev => !prev)
                                }
                            >
                                <Tag size={16} />
                                Labels
                            </button>

                            {isLabelsOpen && (
                                <div className="task-label-picker">
                                    <h4>Labels</h4>

                                    {(board.labels || []).map(label => (
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
                                onClick={() =>
                                    setIsDatesOpen(prev => !prev)
                                }
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

                            <button type="button" disabled>
                                <CheckSquare size={16} />
                                Checklist
                            </button>

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

