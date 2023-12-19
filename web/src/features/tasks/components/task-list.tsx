import { TaskDto } from '@/types';
import { formatDateTime } from '@/utils';

interface TaskListProps {
  tasks: TaskDto[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  return (
    <table className="w-full text-sm font-mono">
      <thead>
        <tr>
          <th className="w-40 text-left bg-amber-800 text-neutral-200 px-3 py-2 rounded-tl">Type</th>
          <th className="w-40 text-left bg-amber-800 text-neutral-200 px-3 py-2">User</th>
          <th className="text-left bg-amber-800 text-neutral-200 px-3 py-2">Name</th>
          <th className="w-56 text-left bg-amber-800 text-neutral-200 px-3 py-2 rounded-tr">Next Run</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => (
          <tr key={task.taskName}>
            <td className="px-3 py-2 border border-neutral-700">{task.type}</td>
            <td className="px-3 py-2 border border-neutral-700">{task.user?.username}</td>
            <td className="px-3 py-2 border border-neutral-700">
              {task.show && <div className="mb-1 text-sky-600">{task.show.name}</div>}
              {task.episode && <div className="mb-1 text-xs text-green-600">{task.episode.name}</div>}
              <div className="text-xs">{task.taskName}</div>
            </td>
            <td className="px-3 py-2 border border-neutral-700">{formatDateTime(task.next)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
