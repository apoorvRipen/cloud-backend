import { Router } from 'express';
import { UserController, uploadController } from '../controllers'

const router = Router();

router.use('/user', UserController);
router.use('/upload', uploadController);

export { router };
