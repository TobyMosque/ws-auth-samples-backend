import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserQueryRequestDto, UserFindRequestDto } from './dto/request.dto';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Prisma } from '@prisma/client';
import { UserQueryResponseDto } from './dto/response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: UserFindRequestDto): Promise<User> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.user.findFirst({
      where: {
        userId: id,
      },
      ...params,
    });
  }

  async query(
    params: UserQueryRequestDto,
    count?: boolean,
  ): Promise<UserQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: UserQueryResponseDto = { data: [] };
    result.data = await this.prisma.user.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.user.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDto): Promise<User | HttpStatus> {
    return this.prisma.user.update({
      where: {
        userId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.user.deleteMany({
      where: {
        userId: id,
      },
    });
  }
}
