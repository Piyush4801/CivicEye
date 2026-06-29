import { News } from '../models/News';

export class NewsService {
  async getAllNews() {
    return await News.find().sort({ createdAt: -1 });
  }

  async getNewsByCategory(category: string) {
    return await News.find({ category }).sort({ createdAt: -1 });
  }

  async createNews(data: any) {
    const news = new News(data);
    return await news.save();
  }
}

export const newsService = new NewsService();
