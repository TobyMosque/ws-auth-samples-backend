import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService, SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
