import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import servicesRoutes from './routes/services.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://meraky-web-nine.vercel.app',
  'https://meraky-bdye0rlpt-romansimunovics-projects.vercel.app',
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/meraky-web.*\.vercel\.app$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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