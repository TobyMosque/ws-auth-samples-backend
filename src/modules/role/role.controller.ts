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
import { RoleService } from './role.service';
import { RoleQueryRequestDto, RoleFindRequestDto } from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from './entities';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { RoleQueryResponseDto } from './dto/response.dto';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: RoleFindRequestDto,
  ): Promise<Role> {
    return this.roleService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => RoleQueryResponseDto })
  query(
    @Query(QueryObjectTrasform) params: RoleQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<RoleQueryResponseDto> {
    return this.roleService.query(params, count);
  }

  @Put()
  create(@Body() data: CreateRoleDto): Promise<Role> {
    return this.roleService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateRoleDto,
  ): Promise<Role> {
    const result = await this.roleService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string) {
    const result = await this.roleService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
