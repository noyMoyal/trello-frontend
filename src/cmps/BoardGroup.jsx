import { TaskPreview } from './TaskPreview'

export function BoardGroup({ group, labels, members }) {
  return (
    <section className="group">
      <h4>{group.title}</h4>
      {group.tasks.map((task) => (
        <TaskPreview
          key={task.id}
          task={task}
          labels={labels}
          members={members}
        />
      ))}
    </section>
  )
}
