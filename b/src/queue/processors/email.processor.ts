import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { MailService } from '../../mail/mail.service';
import { EmailJobData } from '../queue.service';
import { QUEUE_NAMES } from '../../common/constants/app.constants';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, html } = job.data;
    this.logger.log(`Processing email job ${job.id} for ${to}`);
    await this.mailService.sendMail(to, subject, html);
  }
}
