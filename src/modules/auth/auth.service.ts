import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
import { SessionService } from 'src/modules/session/session.service';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { v4 as uid } from 'uuid';
import { PayloadAuthEntity } from './entities/payload-auth.entity';

const scryptAsync = promisify(scrypt);
const jwtOptions: JwtSignOptions = {
  algorithm: 'HS512',
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_AUDIENCE,
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
    return {
      accessToken: this.jwtService.sign(
        payload,
        Object.assign(options, jwtOptions),
      ),
    };
  }

  async logout(payload: PayloadAuthEntity) {
    await this.sessionService.delete(payload.jti);
  }
}
