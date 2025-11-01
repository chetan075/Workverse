import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { StorageService } from './storage.service';

type UploadDto = {
  invoiceId: string;
  filename: string;
  dataBase64: string;
};

@Controller('storage')
export class StorageController {
  constructor(private storage: StorageService) {}

  @Post('upload')
  async upload(@Body() body: UploadDto) {
    const { invoiceId, filename, dataBase64 } = body;
    const res = await this.storage.uploadFromBase64(invoiceId, filename, dataBase64);
    return res;
  }

  @Get('invoice/:id')
  async list(@Param('id') id: string) {
    return this.storage.listForInvoice(id);
  }
}
