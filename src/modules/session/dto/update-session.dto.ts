import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserDto } from '../../user/dto/connect-user.dto';

export class UpdateSessionUserRelationInputDto {
  connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, UpdateSessionUserRelationInputDto)
export class UpdateSessionDto {
  refreshId?: string;
  user?: UpdateSessionUserRelationInputDto;
}
