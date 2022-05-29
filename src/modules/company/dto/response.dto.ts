import { Company } from 'src/modules/company/entities';
import { ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels(Company)
export class CompanyQueryResponseDto {
  data: Company[];
  count?: number;
}
