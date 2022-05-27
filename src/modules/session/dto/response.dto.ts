import { Session } from 'src/modules/session/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Session)
export class SessionQueryResponseDto {
  data: Session[];
  count?: number;
}
