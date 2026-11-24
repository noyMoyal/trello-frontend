import { TaskPreview } from './TaskPreview'

export function BoardGroup({
  group,
  labels,
  members,
  onAddTask,
  onSelectTask,
}) {
  return (
    <section className="group">
      <h4>{group.title}</h4>
      {group.tasks.map((task) => (
        <TaskPreview
          key={task.id}
          task={task}
          labels={labels}
          members={members}
          onSelectTask={onSelectTask}
        />
      ))}
      <button onClick={() => onAddTask(group.id)}>+ Add a card</button>
    </section>
  )
}
