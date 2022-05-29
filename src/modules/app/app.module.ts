import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { RoleModule } from 'src/modules/role/role.module';
import { UserRoleModule } from 'src/modules/userRole/user-role.module';
import { SessionModule } from 'src/modules/session/session.module';
import { PersonModule } from 'src/modules/person/person.module';
import { CompanyModule } from 'src/modules/company/company.module';
import { JobModule } from 'src/modules/job/job.module';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RoleModule,
    UserRoleModule,
    SessionModule,
    PersonModule,
    CompanyModule,
    JobModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
