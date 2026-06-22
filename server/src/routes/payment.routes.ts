import { Router } from 'express';
import { PaymentController, createPaymentSchema } from '../controllers/payment.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new PaymentController();

router.use(authenticate);

router.post('/', validate(createPaymentSchema), controller.create.bind(controller));
router.get('/', controller.list.bind(controller));
router.get('/:id', controller.getById.bind(controller));

export { router as paymentRoutes };
