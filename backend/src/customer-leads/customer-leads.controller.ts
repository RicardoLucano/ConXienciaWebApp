import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CustomerLeadsService } from './customer-leads.service';

@Controller('api/customer-leads')
@UseGuards(AuthGuard)
export class CustomerLeadsController {
  constructor(private customerLeadsService: CustomerLeadsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.customerLeadsService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.customerLeadsService.findOne(id, req.user.sub);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.customerLeadsService.create(req.user.sub, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.customerLeadsService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.customerLeadsService.remove(id, req.user.sub);
  }
}
