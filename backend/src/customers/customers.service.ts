import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.customer.findMany({
      where: { userId },
      include: { purchaseHistory: true },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, userId },
      include: { purchaseHistory: true },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async create(userId: string, data: any) {
    return this.prisma.customer.create({
      data: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        notes: data.notes,
        interestedProducts: data.interestedProducts || [],
        purchasedProducts: data.purchasedProducts || [],
        lastPurchaseDate: data.lastPurchaseDate ? new Date(data.lastPurchaseDate) : null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
        status: data.status || 'active',
        tags: data.tags || [],
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    // Ensure the customer belongs to the user
    await this.findOne(id, userId);

    return this.prisma.customer.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        notes: data.notes,
        interestedProducts: data.interestedProducts,
        purchasedProducts: data.purchasedProducts,
        lastPurchaseDate: data.lastPurchaseDate ? new Date(data.lastPurchaseDate) : null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
        status: data.status,
        tags: data.tags,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async recordPurchase(id: string, userId: string, purchaseData: any) {
    await this.findOne(id, userId);

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the purchase record
      const record = await tx.purchaseRecord.create({
        data: {
          customerId: id,
          product: purchaseData.product,
          amount: parseFloat(purchaseData.amount),
          date: new Date(purchaseData.date || new Date()),
        },
      });

      // 2. Update the customer's last purchase date and add to purchasedProducts list
      const customer = await tx.customer.findUnique({ where: { id } });
      if (customer) {
        const products = new Set(customer.purchasedProducts);
        products.add(purchaseData.product);

        await tx.customer.update({
          where: { id },
          data: {
            lastPurchaseDate: new Date(purchaseData.date || new Date()),
            purchasedProducts: Array.from(products),
          },
        });
      }

      return record;
    });
  }
}
