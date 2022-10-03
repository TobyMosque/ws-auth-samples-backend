
import {Job} from '../../job/entities/job.entity'
import {Company} from '../../company/entities/company.entity'


export class Person {
  personId: string ;
avatar: string ;
firstName: string ;
lastName: string ;
email: string ;
jobId: string ;
job?: Job ;
companyId: string ;
company?: Company ;
isDeleted: boolean ;
createdAt: Date ;
updatedAt: Date ;
deletedAt: Date  | null;
}
