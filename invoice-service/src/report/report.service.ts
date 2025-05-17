import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InvoiceService } from '../invoice/invoice.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron('0 12 * * *')
  async generateDailyReport() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      // Fetch all invoic
      const invoices = await this.invoiceService.findByDateRange(
        today,
        tomorrow,
      );
      if (!invoices || invoices.length === 0) {
        throw new Error('No invoices found for today');
      }

      const totalSales = invoices.reduce(
        (sum, invoice) => sum + invoice.amount,
        0,
      );

      const itemSales = {};
      invoices.forEach((invoice) => {
        invoice.items.forEach((item) => {
          itemSales[item.sku] = (itemSales[item.sku] || 0) + item.qt;
        });
      });

      const report = {
        totalSales,
        itemSales,
        timestamp: new Date().toISOString(),
      };

      try {
        await this.rabbitMQService.sendReport(report);
        console.log(`Report generated and sent at ${new Date().toISOString()}`);
      } catch (rabbitError) {
        console.error(
          'Error sending report to RabbitMQ:',
          rabbitError.message || rabbitError,
        );
        throw new Error('Failed to send report to RabbitMQ');
      }
    } catch (error) {
      console.error('Error generating report:', error.message || error);
    }
  }
}
