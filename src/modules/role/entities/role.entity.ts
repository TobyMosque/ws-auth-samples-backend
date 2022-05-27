import { UserRole } from 'src/modules/userRole/entities/userRole.entity';

export class Role {
  roleId: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  users?: UserRole[];
}
