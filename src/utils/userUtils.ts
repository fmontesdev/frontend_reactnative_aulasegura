import { User } from '../types/User';

export const isUserActive = (user: User): boolean => {
  if (!user.validTo) return true;
  return new Date(user.validTo) > new Date();
};
