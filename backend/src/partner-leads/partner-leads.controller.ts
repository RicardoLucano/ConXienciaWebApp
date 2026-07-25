import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PartnerLeadsService } from './partner-leads.service';

@Controller('api/partner-leads')
@UseGuards(AuthGuard)
export class PartnerLeadsController {
  constructor(private partnerLeadsService: PartnerLeadsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.partnerLeadsService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.partnerLeadsService.findOne(id, req.user.sub);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.partnerLeadsService.create(req.user.sub, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.partnerLeadsService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.partnerLeadsService.remove(id, req.user.sub);
  }
}
