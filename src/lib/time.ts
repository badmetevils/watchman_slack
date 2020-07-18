import moment from 'moment-timezone';

declare module 'moment' {
  interface Moment {
    toMySqlDateTime: () => string;
  }
}

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};

const timeZone = process.env.TIME_ZONE || 'Asia/Kolkata';
const time: typeof moment = moment;

time.tz.setDefault(timeZone);

export default time;
