import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceModule } from './invoice/invoice.module';
import { ReportModule } from './report/report.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    ScheduleModule.forRoot(),
    InvoiceModule,
    ReportModule,
    RabbitMQModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
