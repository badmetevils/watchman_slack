import { Moment } from 'moment-timezone';
import time from '@lib/time';
import { IActiveAwayMinutes } from '@typing/presence';

export const isWorkingHours = (timeStamp: string | undefined | null = null): boolean => {
  const hour = !!timeStamp ? time(timeStamp).hour() : time().hour();

  const start = parseFloat(process.env.WORK_HOUR_START || '10');
  const end = parseFloat(process.env.WORK_HOUR_ENDS || '19');

  if (hour >= start && hour < end) {
    return true;
  }
  return false;
};

export const durationFromTimestampInMinutes = (timeStamp: Moment) => {
  return time.duration(time().diff(timeStamp)).abs().asMinutes();
};

export const getMinutesWhenActive = (lastAwayTimeStamp: Moment): IActiveAwayMinutes => {
  let activeInNonWorkingHours: number = 0;
  let awayInWorkingHours: number = 0;

  const now = time().clone();
  const _startHours = parseFloat(process.env.WORK_HOUR_START || '10');
  const _endHours = parseFloat(process.env.WORK_HOUR_ENDS || '19');
  const _totalTimeElapsed = time.duration(now.diff(lastAwayTimeStamp)).abs().asMinutes();

  const _currentHour = time.duration(now.format('H:mm').toString()).abs().asHours();
  const _lastAwayHours = time.duration(lastAwayTimeStamp.format('H:mm').toString()).abs().asHours();

  const _today12 = time().startOf('day');
  const _startWorkTime = _today12.clone().add(_startHours, 'hour');
  const _endWorkTime = _today12.clone().add(_endHours, 'hour');
  // console.log({
  //   away: {
  //     _totalTimeElapsed: _totalTimeElapsed,
  //     _startWorkTime: _startWorkTime.format('h:mm').toString(),
  //     _endWorkTime: _endWorkTime.format('h:mm').toString(),
  //     _lastAway: lastAwayTimeStamp.format('h:mm').toString()
  //   }
  // });
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
      awayInWorkingHours = time.duration(now.diff(_startWorkTime)).abs().asMinutes();
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
      awayInWorkingHours = _totalTimeElapsed - time.duration(now.diff(_endWorkTime)).abs().asMinutes();
      activeInNonWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if away in NWH1
    if (_lastAwayHours > _endHours) {
      // activeInNonWorkingHours = _totalTimeElapsed;
      activeInNonWorkingHours = 0;
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }
  }
  return { activeInNonWorkingHours, awayInWorkingHours };
};

export const getMinutesWhenAway = (lastActiveTimeStamp: Moment): IActiveAwayMinutes => {
  let activeInNonWorkingHours: number = 0;
  let awayInWorkingHours: number = 0;

  const now = time().clone();
  const _startHours: number = parseFloat(process.env.WORK_HOUR_START || '10');
  const _endHours: number = parseFloat(process.env.WORK_HOUR_ENDS || '19');
  const _totalTimeElapsed = time.duration(now.diff(lastActiveTimeStamp)).abs().asMinutes();

  const _currentHour: number = time.duration(now.format('H:mm').toString()).abs().asHours();
  const _lastActiveHours: number = time.duration(lastActiveTimeStamp.format('H:mm').toString()).abs().asHours();

  const _today12 = time().startOf('day');
  const _startWorkTime = _today12.clone().add(_startHours, 'hour');
  const _endWorkTime = _today12.clone().add(_endHours, 'hour');

  // console.log({
  //   active: {
  //     _totalTimeElapsed: _totalTimeElapsed,
  //     _startWorkTime: _startWorkTime.format('h:mm').toString(),
  //     _endWorkTime: _endWorkTime.format('h:mm').toString(),
  //     _lastActive: lastActiveTimeStamp.format('h:mm').toString()
  //   }
  // });

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
      activeInNonWorkingHours = time.duration(lastActiveTimeStamp.diff(_startWorkTime)).abs().asMinutes();
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
        time.duration(lastActiveTimeStamp.diff(_startWorkTime)).abs().asMinutes() +
        time.duration(now.diff(_endWorkTime)).abs().asMinutes();
      awayInWorkingHours = 0;
      return { activeInNonWorkingHours, awayInWorkingHours };
    }

    // if active in WH
    if (_lastActiveHours >= _startHours && _lastActiveHours <= _endHours) {
      awayInWorkingHours = 0;
      activeInNonWorkingHours = time.duration(now.diff(_endWorkTime)).abs().asMinutes();
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
