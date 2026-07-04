import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/auth.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { ResponseHelper } from '../utils/response.helper';
import { ContactsService } from './contacts.service';
import { SendContactEmailDto } from './dto/contact.dto';

@ApiTags('Admin Contacts')
@ApiBearerAuth()
@Roles('admin')
@Controller('admin/contacts')
export class ContactsAdminController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  async findAll() {
    const messages = await this.contactsService.findAll();
    return ResponseHelper.success(messages);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a contact message' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    await this.contactsService.remove(id);
  }

  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send an email to a contact address' })
  async sendEmail(@Body() dto: SendContactEmailDto) {
    await this.contactsService.sendEmail(dto);
    return ResponseHelper.success(null, 'Email sent successfully');
  }
}
