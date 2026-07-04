import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto, SendContactEmailDto } from './dto/contact.dto';
import { NotFoundException } from '../common/exceptions/business.exception';
import { ContactMailService } from './contact-mail.service';

@Injectable()
export class ContactsService {
  constructor(
    private prisma: PrismaService,
    private contactMailService: ContactMailService,
  ) {}

  async create(dto: CreateContactMessageDto) {
    const message = await this.prisma.contactMessage.create({
      data: {
        googleAccount: dto.googleAccount,
        purpose: dto.purpose,
      },
    });

    await this.contactMailService.sendAutoReplySafe(dto.googleAccount);

    return message;
  }

  async sendEmail(dto: SendContactEmailDto) {
    await this.contactMailService.sendCustomEmail(
      dto.to,
      dto.subject,
      dto.message,
    );
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.contactMessage.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Contact message');
    }
  }
}
