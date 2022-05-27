import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  UserRoleQueryRequestDto,
  UserRoleFindRequestDto,
} from './dto/request.dto';
import { UserRole } from './entities';
import { CreateUserRoleDto, UpdateUserRoleDto } from './dto';
import { Prisma } from '@prisma/client';
import { UserRoleQueryResponseDto } from './dto/response.dto';

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: UserRoleFindRequestDto): Promise<UserRole> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.userRole.findFirst({
      where: {
        userRoleId: id,
      },
      ...params,
    });
  }

  async query(
    params: UserRoleQueryRequestDto,
    count?: boolean,
  ): Promise<UserRoleQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: UserRoleQueryResponseDto = { data: [] };
    result.data = await this.prisma.userRole.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.userRole.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateUserRoleDto): Promise<UserRole> {
    return this.prisma.userRole.create({ data });
  }

  async update(
    id: string,
    data: UpdateUserRoleDto,
  ): Promise<UserRole | HttpStatus> {
    return this.prisma.userRole.update({
      where: {
        userRoleId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.userRole.deleteMany({
      where: {
        userRoleId: id,
      },
    });
  }
}
