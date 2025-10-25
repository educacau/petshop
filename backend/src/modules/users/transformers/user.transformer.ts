import {User} from '@prisma/client';

export type UserResponse = Omit<User, 'passwordHash'>;

export const toUserResponse = (user: User): UserResponse => {
  const {passwordHash, ...rest} = user;
  return rest;
};

export const toUsersResponse = (users: User[]): UserResponse[] => users.map(toUserResponse);
