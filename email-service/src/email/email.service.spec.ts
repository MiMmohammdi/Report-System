import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';
import * as amqp from 'amqplib';

jest.mock('nodemailer');
jest.mock('amqplib');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: any;
  let mockChannel: any;
  let mockConnection: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockTransporter = {
      sendMail: jest
        .fn()
        .mockResolvedValue({ response: 'Email sent successfully' }),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({}),
      consume: jest.fn(),
      ack: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const mockReport = { sales: 1000 };

      const result = await service['sendEmail'](mockReport);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Daily Sales Report',
          text: expect.stringContaining('1000'),
          html: expect.stringContaining('1000'),
        }),
      );
      expect(result).toBe('Email sent successfully');
    });

    it('should handle email sending errors', async () => {
      mockTransporter.sendMail.mockRejectedValue(
        new Error('Email send failed'),
      );

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const mockReport = { sales: 1000 };
      await service['sendEmail'](mockReport);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error sending email:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('sendEmailPublic', () => {
    it('should call sendEmail method', async () => {
      const mockReport = { sales: 1000 };

      const sendEmailSpy = jest.spyOn(service as any, 'sendEmail');

      await service.sendEmailPublic(mockReport);

      expect(sendEmailSpy).toHaveBeenCalledWith(mockReport);
    });
  });

  describe('onModuleInit', () => {
    it('should set up RabbitMQ queue consumption', async () => {
      await service.onModuleInit();

      expect(amqp.connect).toHaveBeenCalledWith(process.env.RABBITMQ_URL);
      expect(mockConnection.createChannel).toHaveBeenCalled();
      expect(mockChannel.assertQueue).toHaveBeenCalledWith(
        'daily_sales_report',
      );
      expect(mockChannel.consume).toHaveBeenCalledWith(
        'daily_sales_report',
        expect.any(Function),
      );
    });

    it('should process and send email for queue message', async () => {
      const mockMsg = {
        content: Buffer.from(JSON.stringify({ sales: 1000 })),
      };

      await service.onModuleInit();

      const consumeCallback = (mockChannel.consume as jest.Mock).mock
        .calls[0][1];

      const sendEmailSpy = jest.spyOn(service as any, 'sendEmail');

      await consumeCallback(mockMsg);

      expect(sendEmailSpy).toHaveBeenCalledWith({ sales: 1000 });
      expect(mockChannel.ack).toHaveBeenCalledWith(mockMsg);
    });
  });
});
