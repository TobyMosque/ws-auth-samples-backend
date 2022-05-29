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
import { SessionService } from './session.service';
import {
  SessionQueryRequestDto,
  SessionFindRequestDto,
} from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Session } from './entities';
import { CreateSessionDto, UpdateSessionDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { SessionQueryResponseDto } from './dto/response.dto';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get(':id')
  @Role('admin')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: SessionFindRequestDto,
  ): Promise<Session> {
    return this.sessionService.find(id, params);
  }

  @Get()
  @Role('admin')
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => SessionQueryResponseDto })
  query(
    @Query(QueryObjectTrasform) params: SessionQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<SessionQueryResponseDto> {
    return this.sessionService.query(params, count);
  }

  @Put()
  create(@Body() data: CreateSessionDto): Promise<Session> {
    return this.sessionService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSessionDto,
  ): Promise<Session> {
    const result = await this.sessionService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string) {
    const result = await this.sessionService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
