import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let model: Model<Invoice>;

  const mockInvoice = {
    customer: 'John Doe',
    amount: 1500,
    reference: 'INV12345',
    date: new Date('2025-04-05T00:00:00.000Z'),
    items: [
      { sku: 'SKU001', qt: 3 },
      { sku: 'SKU002', qt: 7 },
    ],
  };

  const mockInvoiceModel = {
    create: jest.fn().mockResolvedValue(mockInvoice),
    findById: jest.fn().mockResolvedValue(mockInvoice),
    find: jest.fn().mockResolvedValue([mockInvoice]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice and return it', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'John Doe',
        amount: 1500,
        reference: 'INV12345',
        date: new Date('2025-04-05T00:00:00.000Z'),
        items: [
          { sku: 'SKU001', qt: 3 },
          { sku: 'SKU002', qt: 7 },
        ],
      };

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
      expect(mockInvoiceModel.create).toHaveBeenCalledWith(createInvoiceDto);
    });

    it('should throw an error if create fails', async () => {
      mockInvoiceModel.create.mockRejectedValue(
        new Error('Error creating invoice'),
      );

      const createInvoiceDto: CreateInvoiceDto = {
        customer: 'John Doe',
        amount: 1500,
        reference: 'INV12345',
        date: new Date('2025-04-05T00:00:00.000Z'),
        items: [
          { sku: 'SKU001', qt: 3 },
          { sku: 'SKU002', qt: 7 },
        ],
      };

      await expect(service.create(createInvoiceDto)).rejects.toThrowError(
        'Error creating invoice',
      );
    });
  });

  describe('findOne', () => {
    it('should return a single invoice by id', async () => {
      const resultAll = await service.findAll();
      const id = resultAll[0].id;
      const result = await service.findOne(id);
      expect(result).toEqual(mockInvoice);
      expect(mockInvoiceModel.findById).toHaveBeenCalledWith(id);
    });

    it('should throw an error if no invoice is found', async () => {
      mockInvoiceModel.findById.mockResolvedValue(null);
      await expect(service.findOne('invalidid')).rejects.toThrowError(
        'Error finding invoice',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockInvoice]);
      expect(mockInvoiceModel.find).toHaveBeenCalled();
    });
  });

  describe('findByDateRange', () => {
    it('should return invoices within a date range', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');

      const result = await service.findByDateRange(startDate, endDate);
      expect(result).toEqual([mockInvoice]);
      expect(mockInvoiceModel.find).toHaveBeenCalledWith({
        date: { $gte: startDate, $lt: endDate },
      });
    });

    it('should return an empty array if no invoices match the date range', async () => {
      mockInvoiceModel.find.mockResolvedValue([]);
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');
      const result = await service.findByDateRange(startDate, endDate);
      expect(result).toEqual([]);
    });
  });
});
