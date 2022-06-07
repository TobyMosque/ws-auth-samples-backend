import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Delete,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestAuthDto } from './dto/request-auth.dto';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';
import { Response, Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  async login(
    @Req() req: RequestAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginAuthResponseDto> {
    const res = await this.authService.login(req.user);
    const expires = new Date();
    expires.setHours(expires.getHours() + 8);
    response.cookie('REFRESH_TOKEN', res.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      expires,
    });
    return {
      accessToken: res.accessToken,
    };
  }

  @Public()
  @Get('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['REFRESH_TOKEN'];
    if (!refreshToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.authService.refresh(refreshToken);
    if (!accessToken) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return accessToken;
  }

  @Delete('logout')
  async logout(@Req() req: RequestAuthDto) {
    return this.authService.logout(req.user);
  }
}
