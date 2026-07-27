import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  private readonly defaultResourcesList = [
    { id: 'def-1', title: 'OFFIX Login', url: 'https://offix.fuxion.com', icon: '🏢', category: 'Corporativo', orderIndex: 1, isDefault: true },
    { id: 'def-2', title: 'Portal Cliente Preferido', url: 'https://fuxion.com', icon: '⭐', category: 'Corporativo', orderIndex: 2, isDefault: true },
    { id: 'def-3', title: 'Xion Academy', url: 'https://www.youtube.com/@academiaembajadoresxion', icon: '🎓', category: 'Capacitación', orderIndex: 3, isDefault: true },
    { id: 'def-4', title: 'Aware FuXion', url: 'https://www.youtube.com/@fuxionaware', icon: '🌐', category: 'Capacitación', orderIndex: 4, isDefault: true },
    { id: 'def-5', title: 'Soporte WhatsApp', url: 'https://wa.me/51986867611', icon: '💬', category: 'Soporte', orderIndex: 5, isDefault: true },
    { id: 'def-6', title: 'Catálogo de Productos', url: 'https://fuxion.com/products', icon: '🛍️', category: 'Productos', orderIndex: 6, isDefault: true },
  ];

  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const userResources = await this.prisma.resource.findMany({
      where: { userId },
      orderBy: { orderIndex: 'asc' },
    });

    const defaultResources = this.defaultResourcesList.map(res => ({
      ...res,
      userId,
    }));

    return [...defaultResources, ...userResources];
  }

  async findOne(id: string, userId: string) {
    if (id.startsWith('def-')) {
      const defRes = this.defaultResourcesList.find(r => r.id === id);
      if (!defRes) {
        throw new NotFoundException(`Resource with ID ${id} not found`);
      }
      return { ...defRes, userId };
    }

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
    if (id.startsWith('def-')) {
      throw new ForbiddenException('Default resources cannot be modified');
    }
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
    if (id.startsWith('def-')) {
      throw new ForbiddenException('Default resources cannot be deleted');
    }
    await this.findOne(id, userId);
    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
