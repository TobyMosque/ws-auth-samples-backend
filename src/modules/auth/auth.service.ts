import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { SessionService } from 'src/modules/session/session.service';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 as uid } from 'uuid';
import { PayloadAuthEntity } from './entities/payload-auth.entity';
import { LoginAuthResponseEntity } from './entities/login-auth-response.entity';

const scryptAsync = promisify(scrypt);
const jwtOptions: JwtSignOptions = {
  algorithm: 'HS512',
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_AUDIENCE,
  expiresIn: '15s',
};

const refreshOptions: JwtSignOptions = {
  algorithm: 'HS256',
  audience: '',
  issuer: '',
  expiresIn: '8h',
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
    return {
      accessToken,
      refreshToken,
    } as LoginAuthResponseEntity;
  }

  async refresh(token: string) {
    try {
      const { jti } = await this.jwtService.verifyAsync<PayloadAuthEntity>(
        token,
        refreshOptions,
      );

      const session = await this.sessionService.find(jti, {
        select: {
          user: {
            select: {
              userId: true,
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
      console.log(jti, session);
      if (!session || !session.user) {
        return '';
      }

      const user = session.user;
      const payload: Omit<PayloadAuthEntity, 'jti'> = {
        sub: user.userId,
        name: [user.firstName, user.lastName].join(' '),
        email: user.email,
        roles: user.roles?.map((r) => r.role?.name) || [],
      };

      return this.jwtService.sign(
        payload,
        Object.assign({ jwtid: jti }, jwtOptions),
      );
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  async logout(payload: PayloadAuthEntity) {
    await this.sessionService.delete(payload.jti);
  }
}
