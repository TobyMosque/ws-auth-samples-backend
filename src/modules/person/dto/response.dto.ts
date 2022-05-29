import { Person } from 'src/modules/person/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Person)
export class PersonQueryResponseDto {
  data: Person[];
  count?: number;
}
