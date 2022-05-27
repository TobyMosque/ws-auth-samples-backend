import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/role/entities/role.entity';

export class UserRole {
  userRoleId: string;
  userId: string;
  user?: User;
  roleId: string;
  role?: Role;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
