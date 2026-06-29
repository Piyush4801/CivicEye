import express from 'express';
import { getNews, createNews } from '../controllers/newsController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getNews)
  .post(protect, createNews); // Only officials/admins should post

export default router;
