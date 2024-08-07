import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { makeResponse } from '../../lib';

export const getXuser = (req: Request, res: Response, next: NextFunction) => {
    verify(
        String(req.headers['x-user']),
        String(process.env.XUSER_SECRET),
        async (err: any, decoded: any) => {
            if (err) {
                console.log('error message in getx-user:', err);

                return makeResponse(res, 401, false, err.message, undefined);
            }

            req.user = decoded?.user;
            next();
        }
    );
};
