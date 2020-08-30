import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, ACCEPTED } from 'http-status-codes';
import {
  getAllUsers,
  getTimeLogByISlackIDAndDateRange,
  getStatusLogsByIdAndDate,
  aggregateTimeLogByISlackIDAndDateRange
} from '@models/queries';
import APIResponse from '@express-app/APIResponse';
import logger from '@shared/Logger';
import time from '@lib/time';

const pathName = {
  list: '/list',
  getTimeLog: '/get_time_log',
  getActivityLog: '/get_activity_log'
};

// Init shared
const router = Router();

router.get(pathName.list, async (req: Request, res: Response) => {
  const records = await getAllUsers();
  if (!!records) {
    const data = records.map(r => r.get());
    return res.status(ACCEPTED).json(APIResponse({ data, status: 'SUCCESS' }));
  }
  logger.error('API Error when tries to get list of all users');
  return res.status(OK).json(APIResponse({ status: 'FAILURE', message: 'Something went wrong' }));
});

router.post(pathName.getTimeLog, async (req: Request, res: Response) => {
  const defaultDate = time().format('YYYY-MM-DD').toString();
  const { id, fromDate = defaultDate, toDate = defaultDate, limit = 10, offset = 0 } = req.body;
  const startDate = time(fromDate);
  const endDate = time(toDate);

  if (!startDate.isValid() || !endDate.isValid()) {
    return res
      .status(BAD_REQUEST)
      .json(APIResponse({ status: 'FAILURE', message: `the date range seems to be invalid` }));
  }
  if (endDate.isBefore(startDate)) {
    return res.status(BAD_REQUEST).json(APIResponse({ status: 'FAILURE', message: `fromDate can't be after toDate ` }));
  }

  const records = await getTimeLogByISlackIDAndDateRange(
    id,
    startDate.format('YYYY-MM-DD').toString(),
    endDate.format('YYYY-MM-DD').toString(),
    limit,
    offset
  );
  const aggregation = await aggregateTimeLogByISlackIDAndDateRange(
    id,
    startDate.format('YYYY-MM-DD').toString(),
    endDate.format('YYYY-MM-DD').toString()
  );
  if (!!records) {
    const data = records.map(r => r.get());
    const aggData = aggregation?.map(r => r.get())[0];
    return res.status(ACCEPTED).json(
      APIResponse({
        status: 'SUCCESS',
        data: {
          list: data,
          aggregation: aggData
        }
      })
    );
  }
});

router.get(pathName.getActivityLog, async (req: Request, res: Response) => {
  const params = req.query;
  if (!('id' in params && 'date' in params)) {
    return res
      .status(BAD_REQUEST)
      .json(APIResponse({ status: 'FAILURE', message: `missing required params 'id' or 'date'` }));
  }
  // @ts-ignore
  const record = await getStatusLogsByIdAndDate(params.id, params.date);
  return res.status(OK).json(APIResponse({ status: 'SUCCESS', data: record }));
});

export default router;
