import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { InvoiceService } from '../invoice/invoice.service';

jest.mock('../invoice/invoice.service');
jest.mock('../rabbitmq/rabbitmq.service');

describe('ReportService', () => {
  let service: ReportService;
  let invoiceService: InvoiceService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: InvoiceService,
          useValue: {
            findByDateRange: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            sendReport: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    invoiceService = module.get<InvoiceService>(InvoiceService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should generate daily report and send it to RabbitMQ', async () => {
    const mockInvoices = [
      {
        _id: '1',
        customer: 'Customer1',
        amount: 100,
        reference: 'REF123',
        date: new Date('2025-04-07T00:00:00Z'),
        items: [
          { sku: 'item1', qt: 2 },
          { sku: 'item2', qt: 3 },
        ],
      },
      {
        _id: '2',
        customer: 'Customer2',
        amount: 200,
        reference: 'REF124',
        date: new Date('2025-04-07T00:00:00Z'),
        items: [
          { sku: 'item1', qt: 1 },
          { sku: 'item3', qt: 4 },
        ],
      },
    ];

    (invoiceService.findByDateRange as jest.Mock).mockResolvedValue(
      mockInvoices,
    );

    const sendReportSpy = jest
      .spyOn(rabbitMQService, 'sendReport')
      .mockResolvedValue();

    await service.generateDailyReport();

    expect(sendReportSpy).toHaveBeenCalledWith({
      totalSales: 300,
      itemSales: {
        item1: 3,
        item2: 3,
        item3: 4,
      },
      timestamp: expect.any(String),
    });
  });
});
