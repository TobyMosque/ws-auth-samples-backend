import { Controller, Get, Request } from '@nestjs/common';
import { Role } from 'src/decorators/role.decorator';
import { RequestAuthDto } from 'src/modules/auth/dto/request-auth.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  getProfile(@Request() req: RequestAuthDto) {
    return req.user;
  }

  @Get('is-admin')
  @Role('admin')
  isAdmin() {
    return true;
  }

  @Get('is-developer')
  @Role('developer')
  isDeveloper() {
    return true;
  }
}
