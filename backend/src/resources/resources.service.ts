import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.resource.findMany({
      where: { userId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const resource = await this.prisma.resource.findFirst({
      where: { id, userId },
    });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  async create(userId: string, data: any) {
    // Find the next order index
    const maxResource = await this.prisma.resource.findFirst({
      where: { userId },
      orderBy: { orderIndex: 'desc' },
    });
    const nextIndex = maxResource ? maxResource.orderIndex + 1 : 1;

    return this.prisma.resource.create({
      data: {
        userId,
        title: data.title,
        url: data.url,
        icon: data.icon || '🔗',
        category: data.category || 'Corporativo',
        orderIndex: nextIndex,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);

    return this.prisma.resource.update({
      where: { id },
      data: {
        title: data.title,
        url: data.url,
        icon: data.icon,
        category: data.category,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
