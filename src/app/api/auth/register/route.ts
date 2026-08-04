import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(2, 'O nome é obrigatório'),
  cpf: z.string().optional(),
  phone: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, password, name, cpf, phone } = parsed.data;

    // Usando o admin client para contornar a confirmação de email (MVP)
    // Isso cria o usuário com email já confirmado e passa os dados do perfil
    const adminClient = createAdminClient();
    
    const { data: adminData, error: adminError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        cpf,
        phone,
      },
    });

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // Após criar com o Admin, podemos logar o usuário para criar a sessão no cookie
    const supabase = await createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Usuário criado, mas falhou ao logar', details: signInError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Usuário registrado e logado com sucesso', user: adminData.user },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erro interno do servidor' }, { status: 500 });
  }
}
