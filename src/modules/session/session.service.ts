import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  SessionQueryRequestDto,
  SessionFindRequestDto,
} from './dto/request.dto';
import { Session } from './entities';
import { CreateSessionDto, UpdateSessionDto } from './dto';
import { Prisma } from '@prisma/client';
import { SessionQueryResponseDto } from './dto/response.dto';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: SessionFindRequestDto): Promise<Session> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.session.findFirst({
      where: {
        sessionId: id,
      },
      ...params,
    });
  }

  async query(
    params: SessionQueryRequestDto,
    count?: boolean,
  ): Promise<SessionQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: SessionQueryResponseDto = { data: [] };
    result.data = await this.prisma.session.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.session.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateSessionDto): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async update(
    id: string,
    data: UpdateSessionDto,
  ): Promise<Session | HttpStatus> {
    return this.prisma.session.update({
      where: {
        sessionId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.session.deleteMany({
      where: {
        sessionId: id,
      },
    });
  }
}
