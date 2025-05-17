import {
  IsString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsString()
  customer: string;

  @IsNumber()
  amount: number;

  @IsString()
  reference: string;

  @IsDateString()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

export class ItemDto {
  @IsString()
  sku: string;

  @IsNumber()
  qt: number;
}
