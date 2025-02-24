import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT'],  // Allowed methods
  allowedHeaders: ['Content-Type']  // Allowed headers
}));
app.use(express.json());

const port = process.env.PORT || 3000;

console.log('Attempting database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);

app.get('/', (req, res) => {
  res.json({ message: 'TeleClinic API' });
});

app.use(routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 