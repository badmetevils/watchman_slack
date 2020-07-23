import { Moment } from 'moment-timezone';
import time from '@lib/time';
import { IActiveAwayMinutes } from '@typing/presence';

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

export const getMinutesWhenActive = (lastAwayTimeStamp: Moment): IActiveAwayMinutes => {
  let activeInNonWorkingHours: number = 0;
  let awayInWorkingHours: number = 0;

  let now = time();
  let _startHours = parseInt(process.env.WORK_HOUR_START || '10');
  let _endHours = parseInt(process.env.WORK_HOUR_ENDS || '19');
  let _totalTimeElapsed = time.duration(now.diff(lastAwayTimeStamp)).asMinutes();

  let _currentHour = now.hour();
  let _lastAwayHours = lastAwayTimeStamp.hour();

  let _todayZeroTime = time().startOf('day');
  let _todayStartTime = _todayZeroTime.add(_startHours, 'hour');
  let _todayEndTime = _todayZeroTime.add(_endHours, 'hour');

  /**
   *  USER ACTIVE IN  NON-WORK HOUR  1 [before _startHours ]
   */

  if (_currentHour < _startHours) {
    activeInNonWorkingHours = 0;
    awayInWorkingHours = 0;
    return { awayInWorkingHours, activeInNonWorkingHours };
  }

  /**
   *  USER ACTIVE IN WORK HOUR  [between _startHours and _endHours]
   */

  if (_currentHour >= _startHours && _currentHour <= _endHours) {
    if (_lastAwayHours < _startHours) {
      activeInNonWorkingHours = 0;
      awayInWorkingHours = _totalTimeElapsed - time.duration(now.diff(_todayStartTime)).asMinutes();
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    if (_lastAwayHours >= _startHours && _lastAwayHours <= _endHours) {
      awayInWorkingHours = _totalTimeElapsed;
      activeInNonWorkingHours = 0;
      return { awayInWorkingHours, activeInNonWorkingHours };
    }
  }

  /**
   *  USER ACTIVE IN NON WORK HOUR 2 [after _endHours]
   */

  if (_currentHour > _endHours) {
    // away in NWH1
    if (_lastAwayHours < _startHours) {
      activeInNonWorkingHours = 0;
      awayInWorkingHours = Math.abs(_startHours - _endHours) * 60;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if away in WH
    if (_lastAwayHours >= _startHours && _lastAwayHours <= _endHours) {
      awayInWorkingHours = _totalTimeElapsed - time.duration(now.diff(_todayEndTime)).asMinutes();
      activeInNonWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if away in NWH1
    if (_lastAwayHours > _endHours) {
      activeInNonWorkingHours = _totalTimeElapsed;
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }
  }
  return { activeInNonWorkingHours, awayInWorkingHours };
};

export const getMinutesWhenAway = (lastActiveTimeStamp: Moment): IActiveAwayMinutes => {
  let activeInNonWorkingHours = 0;
  let awayInWorkingHours = 0;

  let now = time();
  let _startHours = parseInt(process.env.WORK_HOUR_START || '10');
  let _endHours = parseInt(process.env.WORK_HOUR_ENDS || '19');
  let _totalTimeElapsed = time.duration(now.diff(lastActiveTimeStamp)).asMinutes();

  let _currentHour = now.hour();
  let _lastActiveHours = lastActiveTimeStamp.hour();

  let _todayZeroTime = time().startOf('day');
  let _todayStartTime = _todayZeroTime.add(_startHours, 'hour');
  let _todayEndTime = _todayZeroTime.add(_endHours, 'hour');

  /**
   *  USER AWAY IN  NON-WORK HOUR  1 [before _startHours ]
   */

  if (_currentHour < _startHours) {
    activeInNonWorkingHours = _totalTimeElapsed;
    awayInWorkingHours = 0;
    return { awayInWorkingHours, activeInNonWorkingHours };
  }

  /**
   *  USER ACTIVE IN WORK HOUR  [between _startHours and _endHours]
   */

  if (_currentHour >= _startHours && _currentHour <= _endHours) {
    // Last time active was  before  _todayStartTime
    if (_lastActiveHours < _startHours) {
      activeInNonWorkingHours = time.duration(lastActiveTimeStamp.diff(_todayStartTime)).asMinutes();
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    if (_lastActiveHours >= _startHours && _lastActiveHours <= _endHours) {
      awayInWorkingHours = 0;
      activeInNonWorkingHours = 0;
      return { awayInWorkingHours, activeInNonWorkingHours };
    }
  }

  /**
   *  USER ACTIVE IN NON WORK HOUR 2 [after _endHours]
   */

  if (_currentHour > _endHours) {
    // active in NWH1
    if (_lastActiveHours < _startHours) {
      activeInNonWorkingHours =
        time.duration(lastActiveTimeStamp.diff(_todayStartTime)).asMinutes() +
        time.duration(lastActiveTimeStamp.diff(_todayEndTime)).asMinutes();
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if active in WH
    if (_lastActiveHours >= _startHours && _lastActiveHours <= _endHours) {
      awayInWorkingHours = 0;
      activeInNonWorkingHours = time.duration(now.diff(_todayEndTime)).asMinutes();
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if active in NWH1
    if (_lastActiveHours > _endHours) {
      activeInNonWorkingHours = _totalTimeElapsed;
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }
  }
  return { activeInNonWorkingHours, awayInWorkingHours };
};
