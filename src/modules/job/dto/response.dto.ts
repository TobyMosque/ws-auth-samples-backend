import { Job } from 'src/modules/job/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Job)
export class JobQueryResponseDto {
  data: Job[];
  count?: number;
}
