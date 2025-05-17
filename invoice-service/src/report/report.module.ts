import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [InvoiceModule, RabbitMQModule],
  providers: [ReportService],
})
export class ReportModule {}
