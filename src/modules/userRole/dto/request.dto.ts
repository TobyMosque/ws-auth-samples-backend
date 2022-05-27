import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class UserRoleFindRequestDto extends FindRequestDto<
  Prisma.UserRoleSelect,
  Prisma.UserRoleInclude
> {}

export class UserRoleQueryRequestDto extends QueryRequestDto<
  Prisma.UserRoleWhereInput,
  Prisma.UserRoleWhereUniqueInput,
  Prisma.UserRoleOrderByWithRelationInput,
  Prisma.UserRoleSelect,
  Prisma.UserRoleInclude
> {}
