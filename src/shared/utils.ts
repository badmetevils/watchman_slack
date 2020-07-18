import { Moment } from 'moment-timezone';
import time from '@lib/time';

export const isWorkingHours = (timeStamp: string | undefined | null = null): boolean => {
  let hour = !!timeStamp ? time(timeStamp).hour() : time().hour();

  let start = parseInt(process.env.WORK_HOUR_START || '10');
  let end = parseInt(process.env.WORK_HOUR_END || '19');
  console.log({ start, end });
  if (hour >= start && hour < end) {
    return true;
  }
  return false;
};

export const minutesFromNow = (timeStamp: Moment) => {
  return time.duration(time().diff(timeStamp)).asMinutes();
};
