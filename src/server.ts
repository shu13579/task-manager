import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db';
import taskRouter from './routes/tasks';
import { errorHandler } from './errorHandler';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Task Manager API');
  });

  app.use('/tasks', taskRouter);

  app.use(errorHandler);

  return app;
};

const port = 3000;

export const startServer = async () => {
  const app = createApp();
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

if (require.main === module) {
  startServer().catch(console.error);
}