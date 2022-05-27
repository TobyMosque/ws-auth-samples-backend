import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class SessionFindRequestDto extends FindRequestDto<
  Prisma.SessionSelect,
  Prisma.SessionInclude
> {}

export class SessionQueryRequestDto extends QueryRequestDto<
  Prisma.SessionWhereInput,
  Prisma.SessionWhereUniqueInput,
  Prisma.SessionOrderByWithRelationInput,
  Prisma.SessionSelect,
  Prisma.SessionInclude
> {}
