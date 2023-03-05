import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class CreateSessionUserRelationInputDto {
  connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateSessionUserRelationInputDto)
export class CreateSessionDto {
  sessionId?: string;
  refreshId?: string;
  user: CreateSessionUserRelationInputDto;
}
