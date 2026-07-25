import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerLeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.customerLead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const lead = await this.prisma.customerLead.findFirst({
      where: { id, userId },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async create(userId: string, data: any) {
    return this.prisma.customerLead.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        interest: data.interest,
        notes: data.notes,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: data.status || 'new',
        tags: data.tags || [],
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);

    return this.prisma.customerLead.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        interest: data.interest,
        notes: data.notes,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: data.status,
        tags: data.tags,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.customerLead.delete({
      where: { id },
    });
  }
}
