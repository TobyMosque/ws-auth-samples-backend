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
import { UserRoleService } from './user-role.service';
import {
  UserRoleQueryRequestDto,
  UserRoleFindRequestDto,
} from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from './entities';
import { CreateUserRoleDto, UpdateUserRoleDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { UserRoleQueryResponseDto } from './dto/response.dto';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('user-role')
@Controller('user-role')
@Role('admin')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Get(':id')
  find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: UserRoleFindRequestDto,
  ): Promise<UserRole> {
    return this.userRoleService.find(id, params);
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => UserRoleQueryResponseDto })
  query(
    @Query(QueryObjectTrasform) params: UserRoleQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<UserRoleQueryResponseDto> {
    return this.userRoleService.query(params, count);
  }

  @Put()
  create(@Body() data: CreateUserRoleDto): Promise<UserRole> {
    return this.userRoleService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserRoleDto,
  ): Promise<UserRole> {
    const result = await this.userRoleService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @Role('developer')
  async delete(@Param('id') id: string) {
    const result = await this.userRoleService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
