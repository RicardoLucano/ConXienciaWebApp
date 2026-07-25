import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CustomersService } from './customers.service';

@Controller('api/customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.customersService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.customersService.findOne(id, req.user.sub);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.customersService.create(req.user.sub, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.customersService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.customersService.remove(id, req.user.sub);
  }

  @Post(':id/purchases')
  async recordPurchase(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.customersService.recordPurchase(id, req.user.sub, body);
  }
}

