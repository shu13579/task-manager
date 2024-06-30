import express, { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import { db } from '../db';
import { AppError } from '../errorHandler';

const router = express.Router();

const taskValidationRules = [
  body('title').notEmpty().withMessage('タイトルは必須です'),
  body('description').optional().isString().withMessage('説明は文字列である必要があります'),
  body('priority').optional().isInt().withMessage('優先度は数値である必要があります'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('ステータスは pending か completed である必要があります')
];

// バリデーションエラーをチェックするミドルウェア
const checkValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// すべてのタスクを取得
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await db.all('SELECT * FROM tasks');
    res.json(tasks);
  } catch (error) {
    next(new AppError('タスクの取得に失敗しました', 500));
  }
});

// 新しいタスクを作成
router.post('/', taskValidationRules, checkValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
      [title, description, priority]
    );
    res.status(201).json({ id: result.lastID, title, description, priority });
  } catch (error) {
    console.error('Error details:', error);
    next(new AppError('タスクの作成に失敗しました', 500));
  }
});

// タスクを更新
router.put('/:id', [
  param('id').isInt().withMessage('IDは整数である必要があります'),
  ...taskValidationRules
], checkValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, priority, status } = req.body;
  try {
    await db.run(
      'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ? WHERE id = ?',
      [title, description, priority, status, req.params.id]
    );
    res.json({ message: 'タスクが更新されました' });
  } catch (error) {
    next(new AppError('タスクの更新に失敗しました', 500));
  }
});

// タスクを削除
router.delete('/:id', [
  param('id').isInt().withMessage('IDは整数である必要があります')
], checkValidationErrors, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'タスクが削除されました' });
  } catch (error) {
    next(new AppError('タスクの削除に失敗しました', 500));
  }
});

export default router;
