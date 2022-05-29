import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JobQueryRequestDto, JobFindRequestDto } from './dto/request.dto';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';
import { Prisma } from '@prisma/client';
import { JobQueryResponseDto } from './dto/response.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  find(id: string, params: JobFindRequestDto): Promise<Job> {
    if (params.select && params.include) {
      delete params.include;
    }
    return this.prisma.job.findFirst({
      where: {
        jobId: id,
      },
      ...params,
    });
  }

  async query(
    params: JobQueryRequestDto,
    count?: boolean,
  ): Promise<JobQueryResponseDto> {
    if (params.select && params.include) {
      delete params.include;
    }
    const result: JobQueryResponseDto = { data: [] };
    result.data = await this.prisma.job.findMany(params);
    if (count) {
      const { cursor, where } = params;
      result.count = await this.prisma.job.count({ cursor, where });
    }
    return result;
  }

  create(data: CreateJobDto): Promise<Job> {
    return this.prisma.job.create({ data });
  }

  async update(id: string, data: UpdateJobDto): Promise<Job | HttpStatus> {
    return this.prisma.job.update({
      where: {
        jobId: id,
      },
      data,
    });
  }

  async delete(id: string): Promise<Prisma.BatchPayload | HttpStatus> {
    return this.prisma.job.deleteMany({
      where: {
        jobId: id,
      },
    });
  }
}
