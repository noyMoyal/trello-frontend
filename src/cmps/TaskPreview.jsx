export function TaskPreview({
  task,
  labels,
  members,
  onSelectTask,
  onRemoveTask,
}) {
  const taskLabels = labels.filter((label) => task.labelIds?.includes(label.id))

  return (
    <article className="task" onClick={() => onSelectTask(task)}>
      {taskLabels.length > 0 && (
        <ul className="task-labels">
          {taskLabels.map((label) => (
            <li
              key={label.id}
              title={label.title}
              style={{ backgroundColor: label.color }}
            ></li>
          ))}
        </ul>
      )}
      <p>{task.title}</p>
      <button
        className="btn-remove-task"
        onClick={(ev) => {
          ev.stopPropagation()
          onRemoveTask(task.id)
        }}
      >
        x
      </button>
    </article>
  )
}
