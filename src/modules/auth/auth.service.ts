import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { SessionService } from 'src/modules/session/session.service';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 as uid } from 'uuid';
import { PayloadAuthEntity } from './entities/payload-auth.entity';
import { LoginAuthResponseDto } from './dto/login-auth-response.dto';
import { RefreshAuthResponseDto } from './dto/refresh-auth-response.dto';

const scryptAsync = promisify(scrypt);
const jwtOptions: JwtSignOptions = {
  algorithm: 'HS512',
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_AUDIENCE,
  expiresIn: '30s',
};

const refreshOptions: JwtSignOptions = {
  algorithm: 'HS256',
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_AUDIENCE,
  expiresIn: '24h',
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private jwtService: JwtService,
  ) {}

  async validate(username: string, pass: string) {
    const { data: users } = await this.userService.query({
      where: {
        email: username,
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        salt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!users || !users.length) {
      return null;
    }
    const { password, salt, ...user } = users[0];
    const encryptedPass = (await scryptAsync(pass, salt, 64)) as Buffer;
    if (user && encryptedPass.compare(password) === 0) {
      const response: PayloadAuthEntity = {
        jti: uid(),
        sub: user.userId,
        name: [user.firstName, user.lastName].join(' '),
        email: user.email,
        roles: user.roles?.map((r) => r.role?.name) || [],
      };
      return response;
    }
    return null;
  }

  async login(user: PayloadAuthEntity) {
    const { jti, ...payload } = user;
    const options: JwtSignOptions = {
      jwtid: jti,
    };
    await this.sessionService.create({
      sessionId: jti,
      user: {
        connect: {
          userId: user.sub,
        },
      },
    });

    const accessToken = this.jwtService.sign(
      payload,
      Object.assign(options, jwtOptions),
    );
    const refreshToken = this.jwtService.sign(
      {},
      Object.assign(options, refreshOptions),
    );
    const response: LoginAuthResponseDto = { accessToken, refreshToken };
    return response;
  }

  async refresh(refreshToken: string) {
    const res: RefreshAuthResponseDto = { accessToken: '' };
    if (!refreshToken) {
      return res;
    }
    let isValid: any = false;
    try {
      isValid = await this.jwtService.verifyAsync(refreshToken, refreshOptions);
    } catch (err) {
      isValid = false;
    }
    if (!isValid) {
      return res;
    }
    const payload = this.jwtService.decode(refreshToken);
    if (typeof payload === 'string' || !('jti' in payload)) {
      return res;
    }
    const session = await this.sessionService.find(payload.jti, {
      select: {
        sessionId: true,
        userId: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            roles: {
              select: {
                role: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!session?.sessionId) {
      return res;
    }
    const user: PayloadAuthEntity = {
      jti: session.sessionId,
      sub: session.userId,
      name: [session.user?.firstName, session.user?.lastName].join(' '),
      email: session.user?.email,
      roles: session.user?.roles?.map((r) => r.role?.name) || [],
    };
    const { jti, ..._user } = user;
    const options: JwtSignOptions = {
      jwtid: jti,
    };
    res.accessToken = this.jwtService.sign(
      _user,
      Object.assign(options, jwtOptions),
    );
    return res;
  }

  async logout(payload: PayloadAuthEntity) {
    await this.sessionService.delete(payload.jti);
  }
}
