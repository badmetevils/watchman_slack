import StatusUpdateAt12 from './StatusUpdate';
export default function runCronTask() {
  const status = new StatusUpdateAt12();
  status.run();
}
