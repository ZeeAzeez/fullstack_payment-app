import { Router } from 'express';
import { AuthController, registerSchema, loginSchema, topupSchema } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), controller.register.bind(controller));
router.post('/login', validate(loginSchema), controller.login.bind(controller));
router.get('/profile', authenticate, controller.getProfile.bind(controller));
router.post('/topup', authenticate, validate(topupSchema), controller.topup.bind(controller));

export { router as authRoutes };
