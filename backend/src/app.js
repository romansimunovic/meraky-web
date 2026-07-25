import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import servicesRoutes from './routes/services.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://meraky-bdye0rlpt-romansimunovics-projects.vercel.app',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('API radi');
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/services', servicesRoutes);

export default app;