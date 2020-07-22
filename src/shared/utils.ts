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

export const getMinutesWhenActive = (lastAwayTimeStamp: Moment) => {
  let activeInNWH = 0;
  let awayInWH = 0;

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
    activeInNWH = 0;
    awayInWH = 0;
    return { awayInWH, activeInNWH };
  }

  /**
   *  USER ACTIVE IN WORK HOUR  [between _startHours and _endHours]
   */

  if (_currentHour >= _startHours && _currentHour <= _endHours) {
    if (_lastAwayHours < _startHours) {
      activeInNWH = 0;
      awayInWH = _totalTimeElapsed - time.duration(now.diff(_todayStartTime)).asMinutes();
      return { activeInNWH, awayInWH };
    }

    if (_lastAwayHours >= _startHours && _lastAwayHours <= _endHours) {
      awayInWH = _totalTimeElapsed;
      activeInNWH = 0;
      return { awayInWH, activeInNWH };
    }
  }

  /**
   *  USER ACTIVE IN NON WORK HOUR 2 [after _endHours]
   */

  if (_currentHour > _endHours) {
    // away in NWH1
    if (_lastAwayHours < _startHours) {
      activeInNWH = 0;
      awayInWH = Math.abs(_startHours - _endHours) * 60;
      return { activeInNWH, awayInWH };
    }

    // if away in WH
    if (_lastAwayHours >= _startHours && _lastAwayHours <= _endHours) {
      awayInWH = _totalTimeElapsed - time.duration(now.diff(_todayEndTime)).asMinutes();
      activeInNWH = 0;
      return { activeInNWH, awayInWH };
    }

    // if away in NWH1
    if (_lastAwayHours > _endHours) {
      activeInNWH = _totalTimeElapsed;
      awayInWH = 0;
      return { activeInNWH, awayInWH };
    }
  }
};

export const getMinutesWhenAway = (lastActiveTimeStamp: Moment) => {
  let activeInNWH = 0;
  let awayInWH = 0;

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
    activeInNWH = _totalTimeElapsed;
    awayInWH = 0;
    return { awayInWH, activeInNWH };
  }

  /**
   *  USER ACTIVE IN WORK HOUR  [between _startHours and _endHours]
   */

  if (_currentHour >= _startHours && _currentHour <= _endHours) {
    // Last time active was  before  _todayStartTime
    if (_lastActiveHours < _startHours) {
      activeInNWH = time.duration(lastActiveTimeStamp.diff(_todayStartTime)).asMinutes();
      awayInWH = 0;
      return { activeInNWH, awayInWH };
    }

    if (_lastActiveHours >= _startHours && _lastActiveHours <= _endHours) {
      awayInWH = 0;
      activeInNWH = 0;
      return { awayInWH, activeInNWH };
    }
  }

  /**
   *  USER ACTIVE IN NON WORK HOUR 2 [after _endHours]
   */

  if (_currentHour > _endHours) {
    // active in NWH1
    if (_lastActiveHours < _startHours) {
      activeInNWH =
        time.duration(lastActiveTimeStamp.diff(_todayStartTime)).asMinutes() +
        time.duration(lastActiveTimeStamp.diff(_todayEndTime)).asMinutes();
      awayInWH = 0;
      return { activeInNWH, awayInWH };
    }

    // if active in WH
    if (_lastActiveHours >= _startHours && _lastActiveHours <= _endHours) {
      awayInWH = 0;
      activeInNWH = time.duration(now.diff(_todayEndTime)).asMinutes();
      return { activeInNWH, awayInWH };
    }

    // if active in NWH1
    if (_lastActiveHours > _endHours) {
      activeInNWH = _totalTimeElapsed;
      awayInWH = 0;
      return { activeInNWH, awayInWH };
    }
  }
};
