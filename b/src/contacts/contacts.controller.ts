import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/auth.decorator';
import { ResponseHelper } from '../utils/response.helper';
import { ContactsService } from './contacts.service';
import { CreateContactMessageDto } from './dto/contact.dto';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a contact message' })
  async create(@Body() dto: CreateContactMessageDto) {
    const message = await this.contactsService.create(dto);
    return ResponseHelper.success(message, 'Message sent successfully');
  }
}
