import { Controller, Get, Post, Patch, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.notificationsService.findAll(req.user.sub);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Patch(':id/archive')
  async archive(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.archive(id, req.user.sub);
  }

  @Post('read-all')
  async markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.remove(id, req.user.sub);
  }
}
