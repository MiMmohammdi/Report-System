import { Module } from '@nestjs/common';
import { EmailSenderModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    EmailSenderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
