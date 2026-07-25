import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { CustomerLeadsModule } from './customer-leads/customer-leads.module';
import { PartnersModule } from './partners/partners.module';
import { PartnerLeadsModule } from './partner-leads/partner-leads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ResourcesModule } from './resources/resources.module';
import { CalendarModule } from './calendar/calendar.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    CustomersModule,
    CustomerLeadsModule,
    PartnersModule,
    PartnerLeadsModule,
    NotificationsModule,
    ResourcesModule,
    CalendarModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}




