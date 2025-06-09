
import { User } from '@/types/creator';

export const mapUserWithCompatibility = (user: any): User => ({
  ...user,
  full_name: user.full_name ?? user.full_name_fr ?? '',
  bio: user.bio ?? user.bio_fr ?? ''
});
