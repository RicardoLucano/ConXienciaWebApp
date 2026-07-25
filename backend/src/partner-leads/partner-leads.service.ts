import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnerLeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.partnerLead.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const lead = await this.prisma.partnerLead.findFirst({
      where: { id, userId },
    });
    if (!lead) {
      throw new NotFoundException(`Partner lead with ID ${id} not found`);
    }
    return lead;
  }

  async create(userId: string, data: any) {
    return this.prisma.partnerLead.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        notes: data.notes,
        interestLevel: data.interestLevel || 'medium',
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: data.status || 'new',
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);

    return this.prisma.partnerLead.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        notes: data.notes,
        interestLevel: data.interestLevel,
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        status: data.status,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.partnerLead.delete({
      where: { id },
    });
  }
}
