import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService, PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
