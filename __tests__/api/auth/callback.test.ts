import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/auth/callback/route';
import { createClient } from '@/utils/supabase/server';

describe('GET /api/auth/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = () => {
    const exchangeCodeForSession = vi.fn();
    vi.mocked(createClient).mockResolvedValue({
      auth: { exchangeCodeForSession },
    } as any);
    return exchangeCodeForSession;
  };

  it('should redirect to / if code is valid', async () => {
    const exchangeCodeForSession = mockClient();
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const req = new Request('http://localhost/api/auth/callback?code=abc1234');
    
    const res = await GET(req);

    expect(res.status).toBe(307); // NextResponse.redirect defaults to 307
    expect(res.headers.get('location')).toBe('http://localhost/');
    expect(exchangeCodeForSession).toHaveBeenCalledWith('abc1234');
  });

  it('should redirect to next url if provided', async () => {
    const exchangeCodeForSession = mockClient();
    exchangeCodeForSession.mockResolvedValue({ error: null });

    const req = new Request('http://localhost/api/auth/callback?code=abc1234&next=/dashboard');
    
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/dashboard');
    expect(exchangeCodeForSession).toHaveBeenCalledWith('abc1234');
  });

  it('should redirect to error page if exchange fails', async () => {
    const exchangeCodeForSession = mockClient();
    exchangeCodeForSession.mockResolvedValue({ error: { message: 'Invalid code' } });

    const req = new Request('http://localhost/api/auth/callback?code=invalid-code');
    
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/auth-code-error');
  });

  it('should redirect to error page if code is missing', async () => {
    // We don't even need to mock the exchange since it won't be called
    const req = new Request('http://localhost/api/auth/callback');
    
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/auth-code-error');
  });
});
