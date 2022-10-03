import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { ApiTags, ApiBody, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { RequestAuthDto } from './dto/request-auth.dto';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';
import { FlowType } from './enums';
import { RefreshAuthResponseDto } from './dto/refresh-auth-response.dto';
import { CookieOptions, Request, Response } from 'express';
import { getPreffix } from 'src/index';

function cookieOptions(): CookieOptions {
  return {
    path: [getPreffix(), 'auth', 'refresh'].join('/'),
    // secure: true,
    sameSite: 'lax',
    httpOnly: true,
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginAuthDto })
  @ApiQuery({ name: 'flow', enum: FlowType })
  async login(
    @Req() req: RequestAuthDto,
    @Query() qs: { flow: FlowType },
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginAuthResponseDto> {
    const tokens = await this.authService.login(req.user);
    if (qs.flow == FlowType.server) {
      const { refreshToken } = tokens;
      delete tokens.refreshToken;
      response.cookie('REFRESH_TOKEN', refreshToken, cookieOptions());
    }
    return tokens;
  }

  @Public()
  @Get('refresh')
  @ApiQuery({ name: 'flow', enum: FlowType })
  @ApiHeader({ name: 'RefreshToken' })
  async refresh(
    @Req() request: Request,
    @Query() qs: { flow: FlowType },
  ): Promise<RefreshAuthResponseDto> {
    let refreshToken = '';
    switch (qs.flow) {
      case FlowType.client:
        refreshToken = request.headers['refreshtoken'] as string;
        break;
      case FlowType.server:
        refreshToken = request.cookies['REFRESH_TOKEN'];
        break;
    }
    return await this.authService.refresh(refreshToken);
  }

  @Delete('logout')
  @ApiQuery({ name: 'flow', enum: FlowType })
  async logout(
    @Req() req: RequestAuthDto,
    @Query() qs: { flow: FlowType },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (qs.flow == FlowType.server) {
      response.clearCookie('REFRESH_TOKEN', cookieOptions());
    }
    return this.authService.logout(req.user);
  }
}
