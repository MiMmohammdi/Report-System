import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      const createdInvoice = await this.invoiceModel.create(createInvoiceDto);
      return createdInvoice;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Invoice already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Error creating invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceModel.findById(id);
      if (!invoice) {
        throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
      }
      return invoice;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException(
          'Invalid invoice ID format',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Error finding invoice',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Invoice[]> {
    try {
      return this.invoiceModel.find();
    } catch (error) {
      console.error('Error fetching all invoices:', error.message || error);
      throw new HttpException(
        'Error fetching invoices',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByDateRange(start: Date, end: Date): Promise<Invoice[]> {
    try {
      return this.invoiceModel.find({ date: { $gte: start, $lt: end } });
    } catch (error) {
      console.error(
        'Error fetching invoices by date range:',
        error.message || error,
      );
      throw new HttpException(
        'Error fetching invoices for the given date range',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
