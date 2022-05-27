import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserDto } from 'src/modules/user/dto/connect-user.dto';
import { ConnectRoleDto } from 'src/modules/role/dto/connect-role.dto';

export class UpdateUserRoleUserRelationInputDto {
  connect: ConnectUserDto;
}
export class UpdateUserRoleRoleRelationInputDto {
  connect: ConnectRoleDto;
}

@ApiExtraModels(
  ConnectUserDto,
  UpdateUserRoleUserRelationInputDto,
  ConnectRoleDto,
  UpdateUserRoleRoleRelationInputDto,
)
export class UpdateUserRoleDto {
  user?: UpdateUserRoleUserRelationInputDto;
  role?: UpdateUserRoleRoleRelationInputDto;
}
