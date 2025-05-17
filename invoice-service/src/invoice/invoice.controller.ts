import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './schemas/invoice.schema';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiBody({
    type: CreateInvoiceDto,
    examples: {
      'application/json': {
        value: {
          customer: 'John Doe',
          amount: 1500,
          reference: 'INV56789',
          date: '2025-04-05T00:00:00.000Z',
          items: [
            { sku: 'SKU001', qt: 3 },
            { sku: 'SKU002', qt: 7 },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The invoice has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      return await this.invoiceService.create(createInvoiceDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific invoice by ID' })
  @ApiResponse({
    status: 200,
    description: 'The invoice has been successfully retrieved.',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({
    status: 200,
    description: 'List of invoices',
    type: [Invoice],
  })
  async findAll(): Promise<Invoice[]> {
    return this.invoiceService.findAll();
  }
}
