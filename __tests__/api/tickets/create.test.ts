import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/tickets/route';
import { createClient } from '@/utils/supabase/server';

describe('POST /api/tickets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockClient = () => {
    const getUser = vi.fn();
    const insert = vi.fn();
    const select = vi.fn();
    const single = vi.fn();
    const from = vi.fn();

    // Setup chain: from('tickets').insert().select().single()
    single.mockResolvedValue({
      data: { id: 'ticket-123' },
      error: null
    });
    select.mockReturnValue({ single });
    insert.mockReturnValue({ select, error: null });
    from.mockImplementation((table) => {
      if (table === 'tickets') {
        return { insert };
      }
      if (table === 'ticket_history') {
        // history insert doesn't chain select/single in route
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
    });

    vi.mocked(createClient).mockResolvedValue({
      auth: { getUser },
      from,
    } as any);

    return { getUser, from, insert };
  };

  it('should create a ticket successfully', async () => {
    const { getUser, from, insert } = mockClient();
    getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const req = new Request('http://localhost/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Buraco na rua',
        description: 'Um buraco enorme na rua principal',
        category: 'Pavimentação',
        priority: 'Alta',
        location_type: 'Endereço',
        location_address: 'Rua Principal, 123',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.ticket.id).toBe('ticket-123');
    expect(getUser).toHaveBeenCalled();
    expect(from).toHaveBeenCalledWith('tickets');
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      created_by: 'user-1',
      title: 'Buraco na rua',
      category: 'Pavimentação',
      status: 'Aberto'
    }));
  });

  it('should return 401 if user is not authenticated', async () => {
    const { getUser } = mockClient();
    getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authorized' },
    });

    const req = new Request('http://localhost/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Buraco na rua',
        description: 'Um buraco enorme na rua principal',
        category: 'Pavimentação',
        location_type: 'Endereço',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(401);
    expect(json.error).toBe('Não autorizado');
  });

  it('should return 400 for invalid data', async () => {
    const { getUser } = mockClient();
    getUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });

    const req = new Request('http://localhost/api/tickets', {
      method: 'POST',
      body: JSON.stringify({
        title: '', // Título vazio deve falhar
        description: 'Um buraco enorme na rua principal',
        category: 'Categoria Invalida', // Categoria inválida
        location_type: 'Endereço',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Dados inválidos');
  });
});
