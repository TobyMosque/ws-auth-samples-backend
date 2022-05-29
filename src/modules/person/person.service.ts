import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PersonQueryRequestDto, PersonFindRequestDto } from './dto/request.dto';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { Prisma } from '@prisma/client';
import { PersonQueryResponseDto } from './dto/response.dto';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: PersonFindRequestDto): Promise<Person> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.person.findFirst({
      where: {
        personId: id,
      },
      ...params,
    });
  }

  async query(
    params: PersonQueryRequestDto,
    count?: boolean,
  ): Promise<PersonQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: PersonQueryResponseDto = { data: [] };
    result.data = await this.prisma.person.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.person.count({ cursor, where });
    }
    return result;
  }

  create(data: CreatePersonDto): Promise<Person> {
    return this.prisma.person.create({ data });
  }

  async update(
    id: string,
    data: UpdatePersonDto,
  ): Promise<Person | HttpStatus> {
    return this.prisma.person.update({
      where: {
        personId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.person.deleteMany({
      where: {
        personId: id,
      },
    });
  }
}
