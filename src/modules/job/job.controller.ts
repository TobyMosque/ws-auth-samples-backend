import {
  Body,
  Get,
  Controller,
  Param,
  Query,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JobQueryRequestDto, JobFindRequestDto } from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Job } from './entities';
import { CreateJobDto, UpdateJobDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { JobQueryResponseDto } from './dto/response.dto';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: JobFindRequestDto,
  ): Promise<Job> {
    return await this.jobService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => JobQueryResponseDto })
  async query(
    @Query(QueryObjectTrasform) params: JobQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<JobQueryResponseDto> {
    return await this.jobService.query(params, count);
  }

  @Put()
  @Role('admin')
  create(@Body() data: CreateJobDto): Promise<Job> {
    return this.jobService.create(data);
  }

  @Put(':id')
  @Role('admin')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateJobDto,
  ): Promise<Job> {
    const result = await this.jobService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @Role('developer')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string) {
    const result = await this.jobService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
