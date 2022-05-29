import { ApiExtraModels } from '@nestjs/swagger';
import { ConnectPersonDto } from '../../person/dto/connect-person.dto';

export class CreateCompanyPeopleRelationInputDto {
  connect: ConnectPersonDto[];
}

@ApiExtraModels(ConnectPersonDto, CreateCompanyPeopleRelationInputDto)
export class CreateCompanyDto {
  companyId?: string;
  name: string;
  people?: CreateCompanyPeopleRelationInputDto;
}
