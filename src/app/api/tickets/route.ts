import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const createTicketSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  category: z.enum([
    'Iluminação',
    'Pavimentação',
    'Limpeza',
    'Água',
    'Esgoto',
    'Trânsito',
    'Meio Ambiente',
    'Outros'
  ]),
  priority: z.enum(['Baixa', 'Média', 'Alta']).optional(),
  location_type: z.string().min(1, 'O tipo de localização é obrigatório'),
  location_address: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  image_urls: z.array(z.string().url()).optional().default([]),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createTicketSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      category,
      priority,
      location_type,
      location_address,
      location_lat,
      location_lng,
      image_urls,
    } = parsed.data;

    // Inserir o chamado no banco
    const { data: ticket, error: insertError } = await supabase
      .from('tickets')
      .insert({
        created_by: user.id,
        title,
        description,
        category,
        priority,
        location_type,
        location_address,
        location_lat,
        location_lng,
        image_urls,
        status: 'Aberto'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao inserir chamado:', insertError);
      return NextResponse.json({ error: 'Erro ao criar o chamado' }, { status: 500 });
    }

    // Inserir histórico de criação
    const { error: historyError } = await supabase
      .from('ticket_history')
      .insert({
        ticket_id: ticket.id,
        created_by: user.id,
        action: 'Chamado criado'
      });

    if (historyError) {
      console.error('Erro ao inserir histórico:', historyError);
      // Não falhamos a requisição se o histórico falhar, apenas logamos
    }

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err: any) {
    console.error('Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
