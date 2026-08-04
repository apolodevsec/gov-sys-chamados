import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/auth/logout/route';
import { createClient } from '@/utils/supabase/server';

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = () => {
    const signOut = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: { signOut },
    } as any);
    return signOut;
  };

  it('should logout successfully', async () => {
    const signOut = mockClient();
    signOut.mockResolvedValue({ error: null });

    const res = await POST();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.message).toBe('Logout realizado com sucesso');
    expect(signOut).toHaveBeenCalled();
  });

  it('should handle logout errors', async () => {
    const signOut = mockClient();
    signOut.mockResolvedValue({ error: { message: 'Server error' } });

    const res = await POST();
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Server error');
  });
});
