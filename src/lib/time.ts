import moment from 'moment-timezone';

declare module 'moment' {
  interface Moment {
    toMySqlDateTime: () => string;
  }
}

moment.prototype.toMySqlDateTime = function () {
  return this.format('YYYY-MM-DD HH:mm:ss');
};

const timeZone = 'Asia/Kolkata';
moment.tz.setDefault(timeZone);
const time: typeof moment = moment;

export default time;
