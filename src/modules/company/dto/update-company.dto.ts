
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectPersonDto} from '../../person/dto/connect-person.dto'

export class UpdateCompanyPeopleRelationInputDto {
    connect: ConnectPersonDto[];
  }

@ApiExtraModels(ConnectPersonDto,UpdateCompanyPeopleRelationInputDto)
export class UpdateCompanyDto {
  name?: string;
people?: UpdateCompanyPeopleRelationInputDto;
}
