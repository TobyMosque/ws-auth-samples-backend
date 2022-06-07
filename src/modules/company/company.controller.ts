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
import { CompanyService } from './company.service';
import {
  CompanyQueryRequestDto,
  CompanyFindRequestDto,
} from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { CompanyQueryResponseDto } from './dto/response.dto';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: CompanyFindRequestDto,
  ): Promise<Company> {
    return await this.companyService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => CompanyQueryResponseDto })
  async query(
    @Query(QueryObjectTrasform) params: CompanyQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<CompanyQueryResponseDto> {
    return await this.companyService.query(params, count);
  }

  @Put()
  @Role('admin')
  create(@Body() data: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(data);
  }

  @Put(':id')
  @Role('admin')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCompanyDto,
  ): Promise<Company> {
    const result = await this.companyService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @Role('developer')
  async delete(@Param('id') id: string) {
    const result = await this.companyService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
