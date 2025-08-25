import express from 'express';
import path from 'node:path';

const router = express.Router();

// Prefer env, fall back to a local folder in the repo during dev
const BASE_DIR =
  process.env.DATA_DIR || path.resolve(process.cwd(), 'dev-data');

router.use(
  '/internal',
  express.static(BASE_DIR, {
    extensions: ['json'],
    fallthrough: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.json'))
        res.setHeader('Content-Type', 'application/json');
    },
  })
);

export { router as fileRouter };
