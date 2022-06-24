import { ConfigModule } from '@nestjs/config';

export const config = ConfigModule.forRoot({
  envFilePath: `envs/${process.env.ENV}.env`,
});
