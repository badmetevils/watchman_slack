import StatusUpdateAt12 from './StatusUpdate';
import DeleteStatusLogs from './DeleteStatus';

export default function runCronTask() {
  const status = new StatusUpdateAt12();
  status.run();
  const deleteStatus = new DeleteStatusLogs();
  deleteStatus.run();
}
