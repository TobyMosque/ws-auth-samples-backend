import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class UserFindRequestDto extends FindRequestDto<
  Prisma.UserSelect,
  Prisma.UserInclude
> {}

export class UserQueryRequestDto extends QueryRequestDto<
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserOrderByWithRelationInput,
  Prisma.UserSelect,
  Prisma.UserInclude
> {}
