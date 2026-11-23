export function TaskPreview({ task, labels, members }) {
  const taskLabels = labels.filter((label) => task.labelIds?.includes(label.id))

  return (
    <article className="task">
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
    </article>
  )
}
