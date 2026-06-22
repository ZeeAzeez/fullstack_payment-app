import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth.routes';
import { paymentRoutes } from './routes/payment.routes';
import { userRoutes } from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.isDev ? '*' : process.env.CLIENT_URL }));
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use(compression() as any);
app.use(express.json({ limit: '10kb' }));
app.use(morgan(config.isDev ? 'dev' : 'combined'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export { app };
