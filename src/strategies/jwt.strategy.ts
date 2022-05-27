import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PayloadAuthEntity } from 'src/modules/auth/entities/payload-auth.entity';
import { SessionService } from 'src/modules/session/session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private sessionService: SessionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadAuthEntity) {
    const session = await this.sessionService.find(payload.jti, {});
    if (!session || !session.userId) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
