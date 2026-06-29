import { Request, Response } from 'express';
import { ngoService } from '../services/ngo.service';

export const getNgOs = async (req: Request, res: Response) => {
  try {
    const ngos = await ngoService.getAllNgos();
    res.json(ngos);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getNgoById = async (req: Request, res: Response) => {
  try {
    const ngo = await ngoService.getNgoById(req.params.id as string);
    if (!ngo) {
       return res.status(404).json({ message: 'NGO not found' });
    }
    res.json(ngo);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const createNgo = async (req: Request, res: Response) => {
  try {
    const ngo = await ngoService.createNgo(req.body);
    res.status(201).json(ngo);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
