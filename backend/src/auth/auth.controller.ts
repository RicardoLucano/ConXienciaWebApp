import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard)
  async login(@Request() req: any) {
    // req.user has been decoded and verified by the AuthGuard
    return this.authService.syncUser(req.user);
  }
}

