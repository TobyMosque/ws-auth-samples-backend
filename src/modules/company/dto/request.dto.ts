import { Prisma } from '@prisma/client';
import { FindRequestDto, QueryRequestDto } from 'src/prisma/dto/request.dto';

export class CompanyFindRequestDto extends FindRequestDto<
  Prisma.CompanySelect,
  Prisma.CompanyInclude
> {}

export class CompanyQueryRequestDto extends QueryRequestDto<
  Prisma.CompanyWhereInput,
  Prisma.CompanyWhereUniqueInput,
  Prisma.CompanyOrderByWithRelationInput,
  Prisma.CompanySelect,
  Prisma.CompanyInclude
> {}
