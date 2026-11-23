import { TaskPreview } from './TaskPreview'

export function BoardGroup({ group }) {
  return (
    <section className="group">
      <h4>{group.title}</h4>
      {group.tasks.map((task) => (
        <TaskPreview key={task.id} task={task} />
      ))}
    </section>
  )
}
