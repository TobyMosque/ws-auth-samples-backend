import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class PersonFindRequestDto extends FindRequestDto<
  Prisma.PersonSelect,
  Prisma.PersonInclude
> {}

export class PersonQueryRequestDto extends QueryRequestDto<
  Prisma.PersonWhereInput,
  Prisma.PersonWhereUniqueInput,
  Prisma.PersonOrderByWithRelationInput,
  Prisma.PersonSelect,
  Prisma.PersonInclude
> {}
