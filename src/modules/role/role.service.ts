import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleQueryRequestDto, RoleFindRequestDto } from './dto/request.dto';
import { Role } from './entities';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { Prisma } from '@prisma/client';
import { RoleQueryResponseDto } from './dto/response.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: RoleFindRequestDto): Promise<Role> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.role.findFirst({
      where: {
        roleId: id,
      },
      ...params,
    });
  }

  async query(
    params: RoleQueryRequestDto,
    count?: boolean,
  ): Promise<RoleQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: RoleQueryResponseDto = { data: [] };
    result.data = await this.prisma.role.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.role.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateRoleDto): Promise<Role> {
    return this.prisma.role.create({ data });
  }

  async update(id: string, data: UpdateRoleDto): Promise<Role | HttpStatus> {
    return this.prisma.role.update({
      where: {
        roleId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.role.deleteMany({
      where: {
        roleId: id,
      },
    });
  }
}
