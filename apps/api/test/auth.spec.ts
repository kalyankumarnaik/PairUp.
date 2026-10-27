import { describe, expect, it, beforeEach } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service';
import { MemoryStoreService } from '../src/common/database/memory-store.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService & Adult Verification', () => {
  let authService: AuthService;
  let store: MemoryStoreService;
  let jwtService: JwtService;

  beforeEach(() => {
    store = new MemoryStoreService();
    store.onModuleInit();
    jwtService = new JwtService({ secret: 'test_jwt_secret_key_1234567890' });
    authService = new AuthService(jwtService, store);
  });

  it('successfully registers an adult user (18+) with valid credentials', async () => {
    const result = await authService.signup({
      email: 'newadult@pairup.ai',
      phone: '+919988776655',
      password: 'SecurePassword123!',
      displayName: 'Adult User',
      birthDate: '1998-05-15',
      acceptedTerms: true
    });

    expect(result.user).toBeDefined();
    expect(result.user.isAdultVerified).toBe(true);
    expect(result.tokens.accessToken).toBeDefined();
    expect(result.profile?.displayName).toBe('Adult User');
  });

  it('strictly rejects registration for underage applicants (<18)', async () => {
    await expect(
      authService.signup({
        email: 'teenager@pairup.ai',
        phone: '+919988776654',
        password: 'SecurePassword123!',
        displayName: 'Teen User',
        birthDate: '2012-05-15', // Under 18
        acceptedTerms: true
      })
    ).rejects.toThrow(/18 years old/);
  });

  it('rejects duplicate email registrations', async () => {
    await expect(
      authService.signup({
        email: 'ananya.verma@example.com', // Seeded demo user
        phone: '+919988776611',
        password: 'Password123!',
        displayName: 'Duplicate User',
        birthDate: '1995-01-01',
        acceptedTerms: true
      })
    ).rejects.toThrow(/already exists/);
  });

  it('authenticates valid login and issues access and refresh tokens', async () => {
    const res = await authService.login('ananya.verma@example.com', 'Password123!');
    expect(res.user.email).toBe('ananya.verma@example.com');
    expect(res.tokens.accessToken).toBeDefined();
  });
});
