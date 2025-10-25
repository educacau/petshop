import {Request, Response} from 'express';

import {CreateUserService} from '../services/create-user.service';
import {ListUsersService} from '../services/list-users.service';
import {UpdateUserService} from '../services/update-user.service';
import {DeleteUserService} from '../services/delete-user.service';
import {toUserResponse, toUsersResponse} from '../transformers/user.transformer';

export class UsersController {
  constructor(
    private readonly createUserService = new CreateUserService(),
    private readonly listUsersService = new ListUsersService(),
    private readonly updateUserService = new UpdateUserService(),
    private readonly deleteUserService = new DeleteUserService()
  ) {}

  index = async (req: Request, res: Response) => {
    const {role, skip, take} = req.query;

    const roleValue = typeof role === 'string' ? role.toUpperCase() : undefined;
    const allowedRoles = ['ADMIN', 'STAFF', 'CUSTOMER'] as const;
    const parsedRole = allowedRoles.includes(roleValue as typeof allowedRoles[number])
      ? (roleValue as (typeof allowedRoles)[number])
      : undefined;

    const users = await this.listUsersService.execute({
      role: parsedRole,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined
    });

    res.json({data: toUsersResponse(users)});
  };

  store = async (req: Request, res: Response) => {
    const user = await this.createUserService.execute(req.body);
    res.status(201).json({data: toUserResponse(user)});
  };

  update = async (req: Request, res: Response) => {
    const user = await this.updateUserService.execute({
      id: req.params.id,
      ...req.body
    });

    res.json({data: toUserResponse(user)});
  };

  destroy = async (req: Request, res: Response) => {
    await this.deleteUserService.execute(req.params.id);
    res.status(204).send();
  };
}


