
import {UserRole} from '../../userRole/entities/userRole.entity'
import {Session} from '../../session/entities/session.entity'


export class User {
  userId: string ;
firstName: string ;
lastName: string ;
email: string ;
password: Buffer ;
salt: Buffer ;
isDeleted: boolean ;
createdAt: Date ;
updatedAt: Date ;
deletedAt: Date  | null;
roles?: UserRole[] ;
sessions?: Session[] ;
}
