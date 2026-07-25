import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PartnerLeadsController } from './partner-leads.controller';
import { PartnerLeadsService } from './partner-leads.service';

@Module({
  imports: [AuthModule],
  controllers: [PartnerLeadsController],
  providers: [PartnerLeadsService],
})
export class PartnerLeadsModule {}
