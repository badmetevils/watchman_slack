import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK, ACCEPTED } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getAllUsers, getTimeLogByISlackIDAndDateRange } from '@models/queries';
import APIResponse from '@express-app/APIResponse';
import logger from '@shared/Logger';
import time from '@lib/time';

const pathName = {
  list: '/list',
  getTimeLog: '/get_time_log'
};

// Init shared
const router = Router();

router.get(pathName.list, async (req: Request, res: Response) => {
  let records = await getAllUsers();
  if (!!records) {
    let data = records.map(r => r.get());
    return res.status(ACCEPTED).json(APIResponse({ data, status: 'SUCCESS' }));
  }
  logger.error('API Error when tries to get list of all users');
  return res.status(OK).json(APIResponse({ status: 'FAILURE', message: 'Something went wrong' }));
});

router.post(pathName.getTimeLog, async (req: Request, res: Response) => {
  let defaultDate = time().format('YYYY-MM-DD').toString();
  const { id, fromDate = defaultDate, toDate = defaultDate, limit = 10, offset = 0 } = req.body;
  // if (!id || !fromDate) {
  //   res
  //     .status(BAD_REQUEST)
  //     .json(APIResponse({ status: 'FAILURE', message: `one or more mandatory fields are missing` }));
  // }
  const startDate = time(fromDate);
  const endDate = time(toDate);

  if (!startDate.isValid() || !endDate.isValid()) {
    res.status(BAD_REQUEST).json(APIResponse({ status: 'FAILURE', message: `the date range seems to be invalid` }));
  }
  if (endDate.isBefore(startDate)) {
    res.status(BAD_REQUEST).json(APIResponse({ status: 'FAILURE', message: `fromDate can't be after toDate ` }));
  }

  let records = await getTimeLogByISlackIDAndDateRange(
    id,
    startDate.format('YYYY-MM-DD').toString(),
    endDate.format('YYYY-MM-DD').toString(),
    limit,
    offset
  );
  if (!!records) {
    let data = records.map(r => r.get());
    res.status(ACCEPTED).json(APIResponse({ status: 'SUCCESS', data }));
  }
});

export default router;
