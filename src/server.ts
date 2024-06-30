import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';
import taskRouter from './routes/tasks';
import { errorHandler } from './errorHandler';

export const createApp = () => {
  const app = express();

  const cors = require('cors');
  app.use(cors({
    origin: [
      'https://task-manager-frontend-2wecyl510-shu13579s-projects.vercel.app',
      'https://task-manager-frontend-shu13579s-projects.vercel.app/',
      'https://task-manager-frontend-brown.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Task Manager API');
  });

  app.use('/tasks', taskRouter);

  app.use(errorHandler);

  return app;
};

// PORT環境変数を使うように変更
const PORT = process.env.PORT || 3000;

export const startServer = async () => {
  const app = createApp();
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

// デプロイ時にはこの条件を満たさないため、startServerはここでは呼び出しません。
if (require.main === module) {
  startServer().catch(console.error);
}
