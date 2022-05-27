import { User } from 'src/modules/user/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(User)
export class UserQueryResponseDto {
  data: User[];
  count?: number;
}
