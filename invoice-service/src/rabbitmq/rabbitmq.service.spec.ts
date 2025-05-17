import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';

jest.mock('amqplib');

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let sendToQueueMock: jest.Mock;
  let closeChannelMock: jest.Mock;
  let closeConnectionMock: jest.Mock;
  let connectionMock: any;

  beforeEach(async () => {
    sendToQueueMock = jest.fn();
    closeChannelMock = jest.fn();
    closeConnectionMock = jest.fn();
    connectionMock = {
      createChannel: jest.fn().mockResolvedValue({
        assertQueue: jest.fn().mockResolvedValue(undefined),
        sendToQueue: sendToQueueMock,
        close: closeChannelMock,
      }),
      close: closeConnectionMock,
    };

    (amqp.connect as jest.Mock) = jest.fn().mockResolvedValue(connectionMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQService],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should send report to RabbitMQ queue', async () => {
    const mockReport = { id: 1, name: 'Test Report', date: '2025-04-07' };

    await service.sendReport(mockReport);

    expect(amqp.connect).toHaveBeenCalledWith(process.env.RABBITMQ_URL);
    expect(connectionMock.createChannel).toHaveBeenCalled();
    expect(sendToQueueMock).toHaveBeenCalledWith(
      'daily_sales_report',
      Buffer.from(JSON.stringify(mockReport)),
    );
    expect(closeChannelMock).toHaveBeenCalled();
    expect(closeConnectionMock).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Failed to send report to RabbitMQ');
    (amqp.connect as jest.Mock).mockRejectedValueOnce(error);

    await expect(service.sendReport({ id: 1 })).rejects.toThrowError(error);
  });
});
