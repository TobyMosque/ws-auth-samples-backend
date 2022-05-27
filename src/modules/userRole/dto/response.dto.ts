import { UserRole } from 'src/modules/userRole/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(UserRole)
export class UserRoleQueryResponseDto {
  data: UserRole[];
  count?: number;
}
