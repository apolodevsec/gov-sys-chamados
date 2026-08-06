import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cadastro from './Cadastro';
import { vi } from 'vitest';

// Mock do fetch global
global.fetch = vi.fn();

describe('Cadastro Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders registration form correctly', () => {
    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /crie sua conta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    // Use getAllByLabelText for password fields since there might be overlapping labels or multiple inputs.
    // In this case, "Senha" might match but let's be specific
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('displays error when passwords do not match', async () => {
    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password456' } });
    fireEvent.click(screen.getByLabelText(/eu concordo com os/i));
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles successful registration', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1 } }),
    });

    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/eu concordo com os/i));
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    expect(screen.getByRole('button', { name: /cadastrando\.\.\./i })).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'João Silva', email: 'joao@example.com', password: 'password123' })
      }));
    });
  });

  it('displays error message on failed registration API call', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'E-mail já está em uso' }),
    });

    render(
      <BrowserRouter>
        <Cadastro />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome completo/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/^senha$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/eu concordo com os/i));
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText('E-mail já está em uso')).toBeInTheDocument();
    });
  });
});
