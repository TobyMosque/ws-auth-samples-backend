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
import { UserService } from './user.service';
import { UserQueryRequestDto, UserFindRequestDto } from './dto/request.dto';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { QueryObjectTrasform } from 'src/pipes/object.transform';
import { UserQueryResponseDto } from './dto/response.dto';
import { Public } from 'src/decorators/public.decorator';
import { Role } from 'src/decorators/role.decorator';

@ApiTags('user')
@Controller('user')
@Role('admin')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async find(
    @Param('id') id: string,
    @Query(QueryObjectTrasform) params: UserFindRequestDto,
  ): Promise<User> {
    const user = await this.userService.find(id, params);
    delete user.password;
    delete user.salt;
    return user;
  }

  @Get()
  @ApiQuery({ name: 'count', required: false })
  @ApiOkResponse({ type: () => UserQueryResponseDto })
  async query(
    @Query(QueryObjectTrasform) params: UserQueryRequestDto,
    @Query('count') count?: boolean,
  ): Promise<UserQueryResponseDto> {
    const users = await this.userService.query(params, count);
    for (const user of users.data) {
      delete user.password;
      delete user.salt;
    }
    return users;
  }

  @Put()
  create(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.create(data);
  }

  @Put(':id')
  @ApiQuery({ name: 'rev', required: false })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    const result = await this.userService.update(id, data);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }

  @Delete(':id')
  @Role('developer')
  @ApiQuery({ name: 'rev', required: false })
  async delete(@Param('id') id: string) {
    const result = await this.userService.delete(id);
    if (typeof result === 'number') {
      throw new HttpException(HttpStatus[result], result);
    }
    return result;
  }
}
