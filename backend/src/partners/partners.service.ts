import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.partner.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const partner = await this.prisma.partner.findFirst({
      where: { id, userId },
    });
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async create(userId: string, data: any) {
    return this.prisma.partner.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        country: data.country,
        notes: data.notes,
        currentRank: data.currentRank || 'Socio',
        teamSize: data.teamSize !== undefined ? parseInt(data.teamSize) : 0,
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
        tags: data.tags || [],
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);

    return this.prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        phone: data.phone,
        country: data.country,
        notes: data.notes,
        currentRank: data.currentRank,
        teamSize: data.teamSize !== undefined ? parseInt(data.teamSize) : 0,
        lastContact: data.lastContact ? new Date(data.lastContact) : null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
        tags: data.tags,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
