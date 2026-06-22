import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new UserController();

// Require authentication for all user endpoints
router.use(authenticate);

router.get('/search', controller.searchByEmail.bind(controller));

export { router as userRoutes };
