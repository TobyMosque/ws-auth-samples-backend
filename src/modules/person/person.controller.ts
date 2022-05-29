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
import { PersonService } from './person.service';
import { PersonQueryRequestDto, PersonFindRequestDto } from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Person } from './entities';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { PersonQueryResponseDto } from './dto/response.dto';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('person')
@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: PersonFindRequestDto,
  ): Promise<Person> {
    return await this.personService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => PersonQueryResponseDto })
  async query(
    @Query(QueryObjectTrasform) params: PersonQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<PersonQueryResponseDto> {
    return await this.personService.query(params, count);
  }

  @Put()
  @Role('admin')
  create(@Body() data: CreatePersonDto): Promise<Person> {
    return this.personService.create(data);
  }

  @Put(':id')
  @Role('admin')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePersonDto,
  ): Promise<Person> {
    const result = await this.personService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @Role('developer')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string) {
    const result = await this.personService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
