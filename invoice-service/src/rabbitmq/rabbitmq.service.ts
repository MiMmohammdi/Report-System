import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly queue = 'daily_sales_report';

  async sendReport(report: any): Promise<void> {
    let connection: amqp.Connection | null = null;
    let channel: amqp.Channel | null = null;

    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      console.log('Connected to RabbitMQ');

      channel = await connection.createChannel();
      console.log('Channel created');

      await channel.assertQueue(this.queue);
      console.log(`Queue ${this.queue} asserted`);

      channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(report)));
      console.log('Report sent to queue');
    } catch (error) {
      console.error('Error in RabbitMQService:', error.message || error);
      throw new Error(`Failed to send report to RabbitMQ`);
    } finally {
      try {
        if (channel) {
          await channel.close();
          console.log('Channel closed');
        }
        if (connection) {
          await connection.close();
          console.log('Connection closed');
        }
      } catch (closeError) {
        console.error(
          'Error while closing RabbitMQ connection or channel:',
          closeError.message || closeError,
        );
      }
    }
  }
}
