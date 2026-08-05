import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/auth/me/route';
import { createClient } from '@/utils/supabase/server';

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = () => {
    const getUser = vi.fn();
    const select = vi.fn().mockReturnThis();
    const eq = vi.fn().mockReturnThis();
    const single = vi.fn();
    const from = vi.fn().mockReturnValue({ select, eq, single });

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser },
      from,
    } as any);

    return { getUser, from, select, eq, single };
  };

  it('should return user and profile successfully', async () => {
    const mocks = mockClient();
    
    // Mock user auth
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user123', email: 'test@example.com' } },
      error: null,
    });

    // Mock profile fetch
    mocks.single.mockResolvedValue({
      data: { id: 'user123', name: 'Test User', role: 'user' },
      error: null,
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.user.id).toBe('user123');
    expect(json.profile.name).toBe('Test User');
    expect(mocks.getUser).toHaveBeenCalled();
    expect(mocks.from).toHaveBeenCalledWith('profiles');
    expect(mocks.eq).toHaveBeenCalledWith('id', 'user123');
  });

  it('should return 401 if not authenticated', async () => {
    const mocks = mockClient();
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not logged in' },
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Não autenticado');
  });

  it('should return 500 if profile fetch fails', async () => {
    const mocks = mockClient();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null,
    });
    mocks.single.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    });

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Erro ao buscar perfil do usuário');
    expect(json.details).toBe('Database error');
  });
});
