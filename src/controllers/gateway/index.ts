import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import passport from '../../middlewares/passport';

import { IHeader, IUser, makeResponse, RESPONSE_MESSAGE, verifyResourcePermission } from '../../lib';

const router = Router();

router.route('/')
    .get(passport.authenticate('jwt', { session: false }), async (req: Request, res: Response) => {
        const user = req.user as IUser;
        const header = req.headers as IHeader;

        if (user === undefined) {
            return makeResponse(res, 401, false, RESPONSE_MESSAGE.unauthorized);
        }

        if (user.status !== undefined && ['DELETED', 'INACTIVE'].includes(user?.status)) {
            return makeResponse(res, 401, false, RESPONSE_MESSAGE.blocked_or_removed);
        }

        const resources = user._role?.resources ? user._role?.resources : [];

        const authStatus = verifyResourcePermission(
            header['x-original-uri'],
            header['x-original-method'],
            resources
        );

        if (authStatus === 404) {
            return makeResponse(res, authStatus, false, RESPONSE_MESSAGE.record_not_found);
        }
        if (authStatus === 403) {
            return makeResponse(res, authStatus, false, RESPONSE_MESSAGE.insufficient_permission);
        }

        user._role = { _id: user._role._id };
        res.set('user', sign(
            { user },
            String(process.env.XUSER_SECRET)
        ));
        await makeResponse(res, 200, true, '', user);
    });

export const gatewayController = router;
