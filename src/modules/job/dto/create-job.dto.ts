
import {ApiExtraModels} from '@nestjs/swagger'
import {ConnectPersonDto} from '../../person/dto/connect-person.dto'

export class CreateJobPeopleRelationInputDto {
    connect: ConnectPersonDto[];
  }

@ApiExtraModels(ConnectPersonDto,CreateJobPeopleRelationInputDto)
export class CreateJobDto {
  jobId?: string;
name: string;
people?: CreateJobPeopleRelationInputDto;
}
