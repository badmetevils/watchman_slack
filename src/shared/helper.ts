import time from '@lib/time';

export const isWorkHours = (): boolean => {
  const now = time().clone();
  const _startHours = parseFloat(process.env.WORK_HOUR_START || '10');
  const _endHours = parseFloat(process.env.WORK_HOUR_ENDS || '19');
  const _currentHour = time.duration(now.format('H:mm').toString()).abs().asHours();
  if (_currentHour >= _startHours && _currentHour <= _endHours) {
    return true;
  }
  return false;
};
