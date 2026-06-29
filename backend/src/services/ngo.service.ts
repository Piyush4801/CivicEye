import { Ngo } from '../models/Ngo';

export class NgoService {
  async getAllNgos() {
    return await Ngo.find().sort({ 'metrics.impactScore': -1 });
  }

  async getNgoById(id: string) {
    return await Ngo.findById(id);
  }

  async createNgo(data: any) {
    const ngo = new Ngo(data);
    return await ngo.save();
  }

  // Future: async getNearbyNgos(lng: number, lat: number, distance: number)
}

export const ngoService = new NgoService();
