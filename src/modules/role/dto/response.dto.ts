import { Role } from 'src/modules/role/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Role)
export class RoleQueryResponseDto {
  data: Role[];
  count?: number;
}
