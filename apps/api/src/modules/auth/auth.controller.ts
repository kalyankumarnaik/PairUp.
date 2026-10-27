import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginInput, SignupInput } from '@pairup/validation';
import { User } from '@pairup/domain-types';
import { MemoryStoreService } from '../../common/database/memory-store.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly store: MemoryStoreService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new adult member (18+ verified)' })
  async signup(@Body() body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email or phone and password' })
  async login(@Body() body: LoginInput) {
    return this.authService.login(body.identifier, body.password);
  }

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP verification code (SMS/Email)' })
  async requestOtp(@Body('identifier') identifier: string) {
    return this.authService.requestOtp(identifier);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify 6-digit OTP code' })
  async verifyOtp(
    @Body('identifier') identifier: string,
    @Body('otp') otp: string
  ) {
    return this.authService.verifyOtp(identifier, otp);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh expired access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user profile and status' })
  async getMe(@CurrentUser() user: User) {
    const profile = this.store.profiles.get(user.id);
    return {
      user,
      profile: profile || null
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and terminate active session' })
  async logout() {
    return { loggedOut: true };
  }
}
