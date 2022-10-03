
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectUserRoleDto} from '../../userRole/dto/connect-userRole.dto'

export class UpdateRoleUsersRelationInputDto {
    connect: ConnectUserRoleDto[];
  }

@ApiExtraModels(ConnectUserRoleDto,UpdateRoleUsersRelationInputDto)
export class UpdateRoleDto {
  name?: string;
users?: UpdateRoleUsersRelationInputDto;
}
