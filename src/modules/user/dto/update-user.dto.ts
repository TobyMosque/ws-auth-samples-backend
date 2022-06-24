import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserRoleDto } from '../../userRole/dto/connect-userRole.dto';
import { ConnectSessionDto } from '../../session/dto/connect-session.dto';

export class UpdateUserRolesRelationInputDto {
  connect: ConnectUserRoleDto[];
}
export class UpdateUserSessionsRelationInputDto {
  connect: ConnectSessionDto[];
}

@ApiExtraModels(
  ConnectUserRoleDto,
  UpdateUserRolesRelationInputDto,
  ConnectSessionDto,
  UpdateUserSessionsRelationInputDto,
)
export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: Buffer;
  salt?: Buffer;
  roles?: UpdateUserRolesRelationInputDto;
  sessions?: UpdateUserSessionsRelationInputDto;
}
