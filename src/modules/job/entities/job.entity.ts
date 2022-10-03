
import {Person} from '../../person/entities/person.entity'


export class Job {
  jobId: string ;
name: string ;
people?: Person[] ;
isDeleted: boolean ;
createdAt: Date ;
updatedAt: Date ;
deletedAt: Date  | null;
}
