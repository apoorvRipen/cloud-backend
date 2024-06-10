import { Router } from 'express';
import { UserController, authController, gatewayController, uploadController } from '../controllers'
import { getXuser } from '..//middlewares';

const router = Router();

router.use('/gateway', gatewayController);
router.use('/auth', authController);
router.use('/user', getXuser, UserController);
router.use('/upload', uploadController);

export { router };
