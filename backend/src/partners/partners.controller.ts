import { Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PartnersService } from './partners.service';

@Controller('api/partners')
@UseGuards(AuthGuard)
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.partnersService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.partnersService.findOne(id, req.user.sub);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.partnersService.create(req.user.sub, body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.partnersService.update(id, req.user.sub, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.partnersService.remove(id, req.user.sub);
  }
}
