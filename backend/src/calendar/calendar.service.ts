import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private prisma: PrismaService) {}

  // Cron schedule to run follow-ups scanner daily at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyCalendarSync() {
    this.logger.log('Executing automated Google Calendar follow-ups synchronization scan...');
    try {
      const activeUsers = await this.prisma.user.findMany({
        select: { id: true, email: true },
      });

      for (const user of activeUsers) {
        this.logger.log(`Running sync operations for user: ${user.email} (${user.id})`);
        await this.syncUserFollowUpsToGoogle(user.id);
      }

      this.logger.log('Daily follow-ups sync successfully concluded.');
    } catch (err) {
      this.logger.error('Failed to execute daily follow-ups synchronization scanner:', err.stack);
    }
  }

  async syncUserFollowUpsToGoogle(userId: string) {
    // 1. Fetch upcoming follow-up entities that need calendar booking
    const customersToSync = await this.prisma.customer.findMany({
      where: {
        userId,
        nextFollowUp: {
          gte: new Date(), // scheduled today or in the future
        },
      },
    });

    const leadsToSync = await this.prisma.customerLead.findMany({
      where: {
        userId,
        followUpDate: {
          gte: new Date(),
        },
      },
    });

    this.logger.log(
      `Found ${customersToSync.length} customer follow-ups and ${leadsToSync.length} lead follow-ups for user ${userId}.`
    );

    // 2. Perform synchronization check.
    // In production, we retrieve the user's stored Google OAuth tokens from the database,
    // refresh them if expired, and query the Google Calendar v3 API using `googleapis` library.
    for (const customer of customersToSync) {
      if (!customer.nextFollowUp) continue;
      await this.upsertGoogleCalendarEvent(userId, {
        summary: `📞 Seguimiento: ${customer.fullName} (FuXion CRM)`,
        description: `Notas de seguimiento:\n${customer.notes || 'Sin observaciones.'}\n\nTeléfono: ${customer.phone || 'N/A'}`,
        date: customer.nextFollowUp,
        eventIdKey: `fuxion_customer_${customer.id}`,
      });
    }

    for (const lead of leadsToSync) {
      if (!lead.followUpDate) continue;
      await this.upsertGoogleCalendarEvent(userId, {
        summary: `🔥 Prospecto Seguimiento: ${lead.name}`,
        description: `Notas:\n${lead.notes || 'Sin observaciones.'}\n\nInterés: ${lead.interest || 'N/A'}\nTeléfono: ${lead.phone || 'N/A'}`,
        date: lead.followUpDate,
        eventIdKey: `fuxion_lead_${lead.id}`,
      });
    }
  }

  private async upsertGoogleCalendarEvent(
    userId: string,
    eventPayload: { summary: string; description: string; date: Date; eventIdKey: string }
  ) {
    this.logger.debug(
      `Pushing event to Google Calendar for User ${userId}: "${eventPayload.summary}" scheduled for ${eventPayload.date.toDateString()} (Key: ${eventPayload.eventIdKey})`
    );
    // Placeholder - real implementation uses Google client SDK:
    // const oauth2Client = new google.auth.OAuth2(...);
    // oauth2Client.setCredentials({ refresh_token: userToken });
    // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // await calendar.events.insert({ calendarId: 'primary', resource: { ... } });
    return true;
  }
}
