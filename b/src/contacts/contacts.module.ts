import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { ContactsAdminController } from './contacts-admin.controller';
import { ContactMailService } from './contact-mail.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ContactsController, ContactsAdminController],
  providers: [ContactsService, ContactMailService],
})
export class ContactsModule {}
