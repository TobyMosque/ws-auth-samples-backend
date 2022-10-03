
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectUserRoleDto} from '../../userRole/dto/connect-userRole.dto'
import {ConnectSessionDto} from '../../session/dto/connect-session.dto'

export class CreateUserRolesRelationInputDto {
    connect: ConnectUserRoleDto[];
  }
export class CreateUserSessionsRelationInputDto {
    connect: ConnectSessionDto[];
  }

@ApiExtraModels(ConnectUserRoleDto,CreateUserRolesRelationInputDto,ConnectSessionDto,CreateUserSessionsRelationInputDto)
export class CreateUserDto {
  userId?: string;
firstName: string;
lastName: string;
email: string;
password: Buffer;
salt: Buffer;
roles?: CreateUserRolesRelationInputDto;
sessions?: CreateUserSessionsRelationInputDto;
}
