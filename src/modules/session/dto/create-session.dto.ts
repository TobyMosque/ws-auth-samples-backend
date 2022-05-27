import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserDto } from 'src/modules/user/dto/connect-user.dto';

export class CreateSessionUserRelationInputDto {
  connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, CreateSessionUserRelationInputDto)
export class CreateSessionDto {
  sessionId?: string;
  user: CreateSessionUserRelationInputDto;
}
