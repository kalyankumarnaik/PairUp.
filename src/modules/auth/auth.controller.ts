import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthResponseDto, SessionResponseDto } from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Authentication & Accounts')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new PairUp account' })
  @ApiResponse({ status: 201, description: 'User successfully created', type: AuthResponseDto })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(@Body() dto: RegisterDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.authService.register(dto, ip, userAgent);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and obtain JWT tokens' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 429, description: 'Account locked due to consecutive failed attempts' })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<AuthResponseDto> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ip, userAgent);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue a fresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid, revoked, or expired refresh token' })
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<AuthResponseDto> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.authService.refreshToken(dto.refreshToken, ip, userAgent);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke active session and blacklist bearer token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Headers('authorization') authHeader: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const token = authHeader?.replace('Bearer ', '');
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    await this.authService.logout(user.userId, user.sessionId!, token, ip, userAgent);
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify user email address using token' })
  @ApiResponse({ status: 200, description: 'Email verified' })
  @ApiResponse({ status: 400, description: 'Token invalid or expired' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ success: boolean; message: string }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset verification email' })
  @ApiResponse({ status: 200, description: 'Password reset email triggered' })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
    @Req() req: Request,
  ): Promise<{ message: string; previewToken?: string }> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.authService.forgotPassword(dto, ip, userAgent);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset account password with token and revoke all active sessions' })
  @ApiResponse({ status: 200, description: 'Password reset completed' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const ip = req.ip || (req.headers['x-forwarded-for'] as string);
    const userAgent = req.headers['user-agent'];
    return this.authService.resetPassword(dto, ip, userAgent);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all active sessions for current user' })
  @ApiResponse({ status: 200, description: 'List of sessions', type: [SessionResponseDto] })
  async getSessions(@CurrentUser() user: AuthenticatedUser): Promise<SessionResponseDto[]> {
    return this.authService.getUserSessions(user.userId, user.sessionId!);
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke a specific user session' })
  @ApiParam({ name: 'sessionId', description: 'Session UUID to revoke' })
  @ApiResponse({ status: 200, description: 'Session revoked' })
  async revokeSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
  ): Promise<{ message: string }> {
    await this.authService.revokeSession(user.userId, sessionId);
    return { message: 'Session revoked successfully' };
  }

  @Delete('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all other active sessions except current' })
  @ApiResponse({ status: 200, description: 'Other sessions revoked' })
  async revokeOtherSessions(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ revokedCount: number; message: string }> {
    const result = await this.authService.revokeOtherSessions(user.userId, user.sessionId!);
    return {
      revokedCount: result.revokedCount,
      message: `Revoked ${result.revokedCount} active session(s).`,
    };
  }
}
