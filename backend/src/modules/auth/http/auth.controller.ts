import {toUserResponse} from '@modules/users/transformers/user.transformer';
import {Request, Response} from 'express';

import {AuthenticateService} from '../services/authenticate.service';
import {RegisterCustomerService} from '../services/register-customer.service';
import {UserRepository} from '@modules/users/repositories/user.repository';

export class AuthController {
  constructor(
    private readonly authenticateService = new AuthenticateService(),
    private readonly registerCustomerService = new RegisterCustomerService(),
    private readonly userRepository = new UserRepository()
  ) {}

  login = async (req: Request, res: Response) => {
    const result = await this.authenticateService.execute(req.body);
    res.json({data: result});
  };

  register = async (req: Request, res: Response) => {
    const user = await this.registerCustomerService.execute(req.body);
    res.status(201).json({data: toUserResponse(user)});
  };

  me = async (req: Request, res: Response) => {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }

    const user = await this.userRepository.findById(currentUserId);

    res.json({data: user ? toUserResponse(user) : null});
  };
}


