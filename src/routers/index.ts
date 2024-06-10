import { Router } from 'express';
import { UserController, gatewayController, uploadController } from '../controllers'

const router = Router();

router.use('/gateway', gatewayController);
router.use('/user', UserController);
router.use('/upload', uploadController);

export { router };
