import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';
import { getAllUsers } from '@models/queries';
import APIResponse from '@express-app/APIResponse';
// Init shared
const router = Router();

router.get('/all', async (req: Request, res: Response) => {
  let records = await getAllUsers();
  APIResponse;
  return res.status(OK).json(records);
});

export default router;
