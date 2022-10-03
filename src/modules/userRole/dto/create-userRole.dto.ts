
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectUserDto} from '../../user/dto/connect-user.dto'
import {ConnectRoleDto} from '../../role/dto/connect-role.dto'

export class CreateUserRoleUserRelationInputDto {
    connect: ConnectUserDto;
  }
export class CreateUserRoleRoleRelationInputDto {
    connect: ConnectRoleDto;
  }

@ApiExtraModels(ConnectUserDto,CreateUserRoleUserRelationInputDto,ConnectRoleDto,CreateUserRoleRoleRelationInputDto)
export class CreateUserRoleDto {
  userRoleId?: string;
user: CreateUserRoleUserRelationInputDto;
role: CreateUserRoleRoleRelationInputDto;
}
