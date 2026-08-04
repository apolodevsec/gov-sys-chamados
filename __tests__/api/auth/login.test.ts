import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { createClient } from '@/utils/supabase/server';

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = () => {
    const signInWithPassword = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword },
    } as any);
    return signInWithPassword;
  };

  it('should login successfully', async () => {
    const signInWithPassword = mockClient();
    signInWithPassword.mockResolvedValue({
      data: { user: { id: '1' }, session: { access_token: 'abc' } },
      error: null,
    });

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.user.id).toBe('1');
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should return 400 for invalid validation', async () => {
    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'not-an-email' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Dados inválidos');
  });

  it('should return 401 for invalid credentials', async () => {
    const signInWithPassword = mockClient();
    signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    const req = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Invalid credentials');
  });
});
