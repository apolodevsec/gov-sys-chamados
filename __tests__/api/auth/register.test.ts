import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAdminClient = () => {
    const createUser = vi.fn();
    vi.mocked(createAdminClient).mockReturnValue({
      auth: { admin: { createUser } },
    } as any);
    return createUser;
  };

  const mockClient = () => {
    const signInWithPassword = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: { signInWithPassword },
    } as any);
    return signInWithPassword;
  };

  it('should successfully register and login a user', async () => {
    const createUser = mockAdminClient();
    createUser.mockResolvedValue({ data: { user: { id: '1' } }, error: null });

    const signInWithPassword = mockClient();
    signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.message).toBe('Usuário registrado e logado com sucesso');
    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'test@example.com' })
    );
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should return 400 for invalid data', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'not-an-email',
        password: '123', // too short
        name: '',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Dados inválidos');
  });

  it('should return 400 if admin.createUser fails', async () => {
    const createUser = mockAdminClient();
    createUser.mockResolvedValue({ data: null, error: { message: 'Email already in use' } });

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Email already in use');
  });
});
