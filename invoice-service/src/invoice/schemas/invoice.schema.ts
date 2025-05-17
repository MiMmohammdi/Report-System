import { Expose } from 'class-transformer';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Invoice extends Document {
  @Expose()
  @Prop({ required: true })
  customer: string;

  @Expose()
  @Prop({ required: true })
  amount: number;

  @Expose()
  @Prop({ required: true })
  reference: string;

  @Expose()
  @Prop({ required: true })
  date: Date;

  @Expose()
  @Prop({ type: [{ sku: String, qt: Number }] })
  items: { sku: string; qt: number }[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
