
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectUserRoleDto} from '../../userRole/dto/connect-userRole.dto'

export class CreateRoleUsersRelationInputDto {
    connect: ConnectUserRoleDto[];
  }

@ApiExtraModels(ConnectUserRoleDto,CreateRoleUsersRelationInputDto)
export class CreateRoleDto {
  roleId?: string;
name: string;
users?: CreateRoleUsersRelationInputDto;
}
