import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async markAsRead(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async archive(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.notification.update({
      where: { id },
      data: { archived: true },
    });
  }

  async markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.notification.delete({
      where: { id },
    });
  }
}
