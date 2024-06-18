import { Router } from 'express';
import { UserController, authController, gatewayController, authPrivateController, ObjectController } from '../controllers'
import { getXuser } from '..//middlewares';

const router = Router();

// Public Route 
router.use('/gateway', gatewayController);
router.use('/auth', authController);

// Private Route 
router.use('/authentication', getXuser, authPrivateController);
router.use('/user', getXuser, UserController);
router.use('/object', getXuser, ObjectController);

export { router };
