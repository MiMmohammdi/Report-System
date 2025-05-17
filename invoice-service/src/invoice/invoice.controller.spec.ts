import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import * as request from 'supertest';

describe('InvoiceController', () => {
  let app;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let invoiceService: InvoiceService;

  const mockInvoiceService = {
    create: jest.fn().mockResolvedValue({
      customer: 'John Doe',
      amount: 1500,
      reference: 'INV56789',
      date: new Date(),
      items: [
        { sku: 'SKU001', qt: 3 },
        { sku: 'SKU002', qt: 7 },
      ],
    }),
    findOne: jest.fn().mockResolvedValue({
      id: '67f1b739f16fcc28e8cd1375',
      customer: 'John Doe',
      amount: 1500,
      reference: 'INV56789',
      date: new Date('2025-04-05T00:00:00.000Z'),
      items: [
        { sku: 'SKU001', qt: 3 },
        { sku: 'SKU002', qt: 7 },
      ],
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        customer: 'John Doe',
        amount: 1500,
        reference: 'INV56789',
        date: new Date('2025-04-05T00:00:00.000Z'),
        items: [
          { sku: 'SKU001', qt: 3 },
          { sku: 'SKU002', qt: 7 },
        ],
      },
    ]),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    const controller = app.get(InvoiceController) as InvoiceController;
    expect(controller).toBeDefined();
  });

  describe('POST /invoices', () => {
    it('should create a new invoice and return it', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'John Doe',
        amount: 1500,
        reference: 'INV56789',
        date: new Date('2025-04-05T00:00:00.000Z'),
        items: [
          { sku: 'SKU001', qt: 3 },
          { sku: 'SKU002', qt: 7 },
        ],
      };

      return request(app.getHttpServer())
        .post('/invoices')
        .send(createInvoiceDto)
        .expect(201);
    });
  });

  describe('GET /invoices/:id', () => {
    it('should return an invoice by id', async () => {
      const id = '67f1b739f16fcc28e8cd1375';
      return request(app.getHttpServer())
        .get(`/invoices/${id}`)
        .expect(200)
        .expect({
          id: '67f1b739f16fcc28e8cd1375',
          customer: 'John Doe',
          amount: 1500,
          reference: 'INV56789',
          date: '2025-04-05T00:00:00.000Z',
          items: [
            { sku: 'SKU001', qt: 3 },
            { sku: 'SKU002', qt: 7 },
          ],
        });
    });
  });

  describe('GET /invoices', () => {
    it('should return an array of invoices', async () => {
      return request(app.getHttpServer())
        .get('/invoices')
        .expect(200)
        .expect([
          {
            customer: 'John Doe',
            amount: 1500,
            reference: 'INV56789',
            date: '2025-04-05T00:00:00.000Z',
            items: [
              { sku: 'SKU001', qt: 3 },
              { sku: 'SKU002', qt: 7 },
            ],
          },
        ]);
    });
  });
});
