import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectUserDto } from 'src/modules/user/dto/connect-user.dto';

export class UpdateSessionUserRelationInputDto {
  connect: ConnectUserDto;
}

@ApiExtraModels(ConnectUserDto, UpdateSessionUserRelationInputDto)
export class UpdateSessionDto {
  user?: UpdateSessionUserRelationInputDto;
}
