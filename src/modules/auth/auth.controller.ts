import { Controller, Post, UseGuards, Request, Delete } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestAuthDto } from './dto/request-auth.dto';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  async login(@Request() req: RequestAuthDto): Promise<LoginAuthResponseDto> {
    return this.authService.login(req.user);
  }

  @Delete('logout')
  async logout(@Request() req: RequestAuthDto) {
    return this.authService.logout(req.user);
  }
}
