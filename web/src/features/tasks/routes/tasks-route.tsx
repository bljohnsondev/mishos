import * as React from 'react';

import { PageTitle, Section } from '@/components/layout';
import { TaskDto } from '@/types';

import { getTasks } from '../api/api-tasks';
import { TaskList } from '../components/task-list';

export const TaskRoute = () => {
  const [tasks, setTasks] = React.useState<TaskDto[] | undefined>();

  React.useEffect(() => {
    getTasks().then(tlist => setTasks(tlist));
  }, []);

  return (
    <section>
      <PageTitle title="Running Tasks" />
      {tasks ? <TaskList tasks={tasks} /> : <Section>No tasks are currently running</Section>}
    </section>
  );
};
