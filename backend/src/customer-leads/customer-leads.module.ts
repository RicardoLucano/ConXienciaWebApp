import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CustomerLeadsController } from './customer-leads.controller';
import { CustomerLeadsService } from './customer-leads.service';

@Module({
  imports: [AuthModule],
  controllers: [CustomerLeadsController],
  providers: [CustomerLeadsService],
})
export class CustomerLeadsModule {}
