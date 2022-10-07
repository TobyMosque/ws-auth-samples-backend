import { User } from '../../user/entities/user.entity';

export class Session {
  sessionId: string;
  refresh: string | null;
  userId: string;
  user?: User;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
