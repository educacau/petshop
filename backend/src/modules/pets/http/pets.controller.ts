import {Request, Response} from 'express';
import {UserRole} from '@prisma/client';

import {CreatePetService} from '../services/create-pet.service';
import {ListPetsService} from '../services/list-pets.service';
import {UpdatePetService} from '../services/update-pet.service';
import {DeletePetService} from '../services/delete-pet.service';

export class PetsController {
  constructor(
    private readonly createPetService = new CreatePetService(),
    private readonly listPetsService = new ListPetsService(),
    private readonly updatePetService = new UpdatePetService(),
    private readonly deletePetService = new DeletePetService()
  ) {}

  listMine = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }
    const customerId = req.user.id;
    const pets = await this.listPetsService.execute(customerId);
    res.json({data: pets});
  };

  listAll = async (_req: Request, res: Response) => {
    const pets = await this.listPetsService.execute();
    res.json({data: pets});
  };

  listByCustomer = async (req: Request, res: Response) => {
    const pets = await this.listPetsService.execute(req.params.customerId);
    res.json({data: pets});
  };

  create = async (req: Request, res: Response) => {
    const pet = await this.createPetService.execute(req.body);
    res.status(201).json({data: pet});
  };

  update = async (req: Request, res: Response) => {
    const pet = await this.updatePetService.execute({
      id: req.params.id,
      data: req.body
    });

    res.json({data: pet});
  };

  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }

    await this.deletePetService.execute({
      id: req.params.id,
      requesterId: req.user.id,
      role: req.user.role as UserRole
    });

    res.status(204).send();
  };
}
