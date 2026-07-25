import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async syncUser(payload: { sub: string; email: string; user_metadata?: { full_name?: string; avatar_url?: string } }) {
    const { sub, email, user_metadata } = payload;
    const fullName = user_metadata?.full_name || email.split('@')[0];
    const avatarUrl = user_metadata?.avatar_url || '';

    // Check if the user exists in our local database
    let user = await this.prisma.user.findUnique({
      where: { id: sub },
    });

    if (!user) {
      // Create a local record mapped to the Supabase auth UUID
      user = await this.prisma.user.create({
        data: {
          id: sub,
          email,
          fullName,
          avatarUrl,
          role: 'owner', // Default role for the creator/owner
        },
      });
    } else {
      // Keep profile fields in sync
      user = await this.prisma.user.update({
        where: { id: sub },
        data: {
          email,
          fullName,
          avatarUrl,
        },
      });
    }

    return user;
  }
}
