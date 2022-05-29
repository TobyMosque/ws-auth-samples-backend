import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { IS_NO_ROLE_KEY } from 'src/decorators/role.decorator';
import { take } from 'rxjs';
import { PayloadAuthEntity } from 'src/modules/auth/entities/payload-auth.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    let isValid = false;
    const boolean = super.canActivate(context);
    if (typeof boolean !== 'boolean') {
      if ('then' in boolean) {
        isValid = await boolean;
      } else {
        isValid = await new Promise((resolve) => {
          boolean.pipe(take(1)).subscribe(resolve);
        });
      }
    } else {
      isValid = boolean;
    }
    const roleName = this.reflector.getAllAndOverride<string>(IS_NO_ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isValid && roleName) {
      const user = context['args'][0].user as PayloadAuthEntity;
      isValid = user.roles?.includes(roleName);
    }
    return isValid;
  }
}
