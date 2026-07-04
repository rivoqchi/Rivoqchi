import { Injectable, Logger } from '@nestjs/common';
import { Locale } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeSiteUrl } from '../shared/utils/site-url.util';

@Injectable()
export class ContactMailService {
  private readonly logger = new Logger(ContactMailService.name);

  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async sendAutoReply(to: string): Promise<void> {
    const profile = await this.getOwnerProfile();
    const subject = 'Xabaringiz qabul qilindi';
    const html = this.buildAutoReplyHtml(profile);

    await this.mailService.sendMail(to, subject, html);
  }

  async sendCustomEmail(to: string, subject: string, message: string): Promise<void> {
    const profile = await this.getOwnerProfile();
    const html = this.buildCustomEmailHtml(profile, message);

    await this.mailService.sendMail(to, subject, html);
  }

  async sendAutoReplySafe(to: string): Promise<void> {
    try {
      await this.sendAutoReply(to);
    } catch (error) {
      this.logger.error(`Auto-reply failed for ${to}`, error);
    }
  }

  private async getOwnerProfile(): Promise<{ name: string; siteUrl: string }> {
    const [personal, siteSettings] = await Promise.all([
      this.prisma.personalInfo.findUnique({
        where: { locale: Locale.uz },
        select: { name: true },
      }),
      this.prisma.siteSetting.findMany({
        where: { key: { in: ['name', 'url'] } },
        select: { key: true, value: true },
      }),
    ]);

    const settings = Object.fromEntries(siteSettings.map((item) => [item.key, item.value]));
    const personalName = personal?.name?.trim();
    const siteName = settings.name?.trim();

    return {
      name: personalName || siteName || 'Portfolio egasi',
      siteUrl: settings.url?.trim() ? normalizeSiteUrl(settings.url.trim()) : '',
    };
  }

  private buildAutoReplyHtml(profile: { name: string; siteUrl: string }): string {
    const siteLink = this.buildSiteLinkHtml(profile.siteUrl);

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <p>Assalomu alaykum!</p>
        <p>Xabaringiz muvaffaqiyatli qabul qilindi. Tez orada habaringizga javob olasiz.</p>
        ${siteLink}
        <p style="margin-top: 24px;">Hurmat bilan,<br><strong>${this.escapeHtml(profile.name)}</strong></p>
      </div>
    `;
  }

  private buildCustomEmailHtml(
    profile: { name: string; siteUrl: string },
    message: string,
  ): string {
    const paragraphs = message
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${this.escapeHtml(line)}</p>`)
      .join('');

    const siteLink = this.buildSiteLinkHtml(profile.siteUrl);

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        ${paragraphs}
        ${siteLink}
        <p style="margin-top: 24px;">Hurmat bilan,<br><strong>${this.escapeHtml(profile.name)}</strong></p>
      </div>
    `;
  }

  private buildSiteLinkHtml(siteUrl: string): string {
    if (!siteUrl) return '';

    const safeUrl = this.escapeHtml(siteUrl);

    return `
      <p style="margin-top: 16px;">
        Saytim:
        <a href="${safeUrl}" style="color: #2563eb; text-decoration: underline;">${safeUrl}</a>
      </p>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}
