import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class RoleFindRequestDto extends FindRequestDto<
  Prisma.RoleSelect,
  Prisma.RoleInclude
> {}

export class RoleQueryRequestDto extends QueryRequestDto<
  Prisma.RoleWhereInput,
  Prisma.RoleWhereUniqueInput,
  Prisma.RoleOrderByWithRelationInput,
  Prisma.RoleSelect,
  Prisma.RoleInclude
> {}
