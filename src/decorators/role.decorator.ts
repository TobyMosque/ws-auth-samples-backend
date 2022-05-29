import { SetMetadata, applyDecorators } from '@nestjs/common';

export const IS_NO_ROLE_KEY = 'isOnRole';
export function Role(role: string) {
  return applyDecorators(SetMetadata(IS_NO_ROLE_KEY, role));
}
