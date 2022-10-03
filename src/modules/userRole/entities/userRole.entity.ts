
import {User} from '../../user/entities/user.entity'
import {Role} from '../../role/entities/role.entity'


export class UserRole {
  userRoleId: string ;
userId: string ;
user?: User ;
roleId: string ;
role?: Role ;
isDeleted: boolean ;
createdAt: Date ;
updatedAt: Date ;
deletedAt: Date  | null;
}
