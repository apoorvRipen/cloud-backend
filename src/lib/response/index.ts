import { Response } from 'express';

const makeResponse = async (
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  payload: any = undefined,
  meta: any = {}) =>
  new Promise<any>(resolve => {
    res.status(statusCode)
      .send({
        success,
        message,
        data: payload,
        meta
      });
    resolve(statusCode);
  });

export { makeResponse };
