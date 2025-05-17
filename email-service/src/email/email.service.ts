import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly queue = 'daily_sales_report';
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10) || 1025,
      secure: false,
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async onModuleInit() {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(this.queue);
      channel.consume(this.queue, (msg) => {
        if (msg !== null) {
          try {
            const report = JSON.parse(msg.content.toString());
            this.sendEmail(report);
            channel.ack(msg);
          } catch (error) {
            console.error(
              'Error processing message from RabbitMQ:',
              error.message || error,
            );
            channel.nack(msg);
          }
        }
      });
    } catch (error) {
      console.error(
        'Error initializing RabbitMQ connection:',
        error.message || error,
      );
    }
  }

  private async sendEmail(report: any) {
    const mailOptions = {
      from: process.env.MAIL_FROM ?? 'email@example.com',
      to: process.env.MAIL_TO ?? 'recipient@example.com',
      subject: 'Daily Sales Report',
      text: `Dear user, here is the daily sales report: ${JSON.stringify(report)}`,
      html: `<p>Dear user, here is the daily sales report:</p><pre>${JSON.stringify(report)}</pre>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return info.response;
    } catch (error) {
      console.error('Error sending email:', error.message || error);
      throw new Error(
        `Failed to send email: ${error.message || 'Unknown error'}`,
      );
    }
  }

  public async sendEmailPublic(report: any) {
    try {
      return await this.sendEmail(report);
    } catch (error) {
      console.error('Error in sendEmailPublic:', error.message || error);
      throw new Error(
        `Failed to send public email: ${error.message || 'Unknown error'}`,
      );
    }
  }
}
