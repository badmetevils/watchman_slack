import { Moment } from 'moment-timezone';
import time from '@lib/time';

export const isWorkingHours = (timeStamp: string | undefined | null = null): boolean => {
  let hour = !!timeStamp ? time(timeStamp).hour() : time().hour();

  let start = parseInt(process.env.WORK_HOUR_START || '10');
  let end = parseInt(process.env.WORK_HOUR_ENDS || '19');

  if (hour >= start && hour < end) {
    return true;
  }
  return false;
};

export const durationFromTimestampInMinutes = (timeStamp: Moment) => {
  return time.duration(time().diff(timeStamp)).asMinutes();
};

// export const minutesFromNow = (timeStamp: Moment) => {
//   let start = parseInt(process.env.WORK_HOUR_START || '10');
//   let end = parseInt(process.env.WORK_HOUR_ENDS || '19');
//   let now = time();
//   let totalMinutes = time.duration(now.diff(timeStamp)).asMinutes();

//   let __startTime = time().startOf('day').add(start, 'hour');
//   let __endTime = time().startOf('day').add(end, 'hour');
//   let __today12 = time().startOf('day');
//   let __lastAwayHours = timeStamp.hour();
// };
