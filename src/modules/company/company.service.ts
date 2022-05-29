import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CompanyQueryRequestDto,
  CompanyFindRequestDto,
} from './dto/request.dto';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Prisma } from '@prisma/client';
import { CompanyQueryResponseDto } from './dto/response.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: CompanyFindRequestDto): Promise<Company> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.company.findFirst({
      where: {
        companyId: id,
      },
      ...params,
    });
  }

  async query(
    params: CompanyQueryRequestDto,
    count?: boolean,
  ): Promise<CompanyQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: CompanyQueryResponseDto = { data: [] };
    result.data = await this.prisma.company.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.company.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateCompanyDto): Promise<Company> {
    return this.prisma.company.create({ data });
  }

  async update(
    id: string,
    data: UpdateCompanyDto,
  ): Promise<Company | HttpStatus> {
    return this.prisma.company.update({
      where: {
        companyId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.company.deleteMany({
      where: {
        companyId: id,
      },
    });
  }
}
