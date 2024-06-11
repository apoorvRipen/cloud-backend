import { Router } from 'express';
import { UserController, authController, gatewayController, uploadController, authPrivateController } from '../controllers'
import { getXuser } from '..//middlewares';

const router = Router();

router.use('/gateway', gatewayController);
router.use('/auth', authController);
router.use('/upload', uploadController);
router.use('/authentication', getXuser, authPrivateController);
router.use('/user', getXuser, UserController);

export { router };
