import { Controller, Get, Request } from '@nestjs/common';
import { RequestAuthDto } from 'src/modules/auth/dto/request-auth.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  getProfile(@Request() req: RequestAuthDto) {
    return req.user;
  }
}
