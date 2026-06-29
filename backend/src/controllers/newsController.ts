import { Request, Response } from 'express';
import { newsService } from '../services/news.service';

export const getNews = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let news;
    
    if (category) {
      news = await newsService.getNewsByCategory(category as string);
    } else {
      news = await newsService.getAllNews();
    }
    
    res.json(news);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    // Note: In real app, verify req.user.role === 'official' or 'admin'
    const news = await newsService.createNews(req.body);
    res.status(201).json(news);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
