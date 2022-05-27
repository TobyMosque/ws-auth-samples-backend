
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectUserDto} from '../../user/dto/connect-user.dto'
import {ConnectRoleDto} from '../../role/dto/connect-role.dto'

export class UpdateUserRoleUserRelationInputDto {
    connect: ConnectUserDto;
  }
export class UpdateUserRoleRoleRelationInputDto {
    connect: ConnectRoleDto;
  }

@ApiExtraModels(ConnectUserDto,UpdateUserRoleUserRelationInputDto,ConnectRoleDto,UpdateUserRoleRoleRelationInputDto)
export class UpdateUserRoleDto {
  user?: UpdateUserRoleUserRelationInputDto;
role?: UpdateUserRoleRoleRelationInputDto;
}
