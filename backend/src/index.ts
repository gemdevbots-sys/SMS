import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import apiRoutes from './routes/apiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('АСУ-Оповещение Backend API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
