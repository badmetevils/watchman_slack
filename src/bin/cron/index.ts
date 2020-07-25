import StatusUpdateAt12 from './StatusUpdate';
export default function runCronTask() {
  let status = new StatusUpdateAt12();
  status.run();
}
