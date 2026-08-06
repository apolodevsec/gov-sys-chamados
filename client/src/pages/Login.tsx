import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao realizar login');
      }

      // Login success, redirect to a dashboard or home
      navigate('/dashboard'); // or wherever appropriate
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-background">
      <div className="flex flex-col w-full h-full justify-center items-center px-margin-mobile py-lg pb-xl min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md mx-auto bg-surface-container-lowest shadow-md rounded-xl p-margin-desktop flex flex-col gap-lg relative overflow-hidden">
          {/* Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary"></div>
          
          {/* Header */}
          <div className="flex flex-col items-center text-center gap-xs mt-sm">
            <img 
              alt="Civic Connect Logo" 
              className="w-16 h-16 rounded-lg mb-sm" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLtuJp2sMdpduJgxnMgpvTjqE4Lf7o0VG1U6W3ZMuBTkkjQjYLMUMfNsDIAuCmtR5-_tFjbYBoijfOB8Ygj0wh2uVbh-RPgRY7nm13_FX4wavGXGHzWmgSEr4EYNibYhc9NOn56AtJIuZ-axC8QNCQHybcO3qaXuc76fX_bAlZJ3HZ79OMjRJIvgI8ktIDYdu1RI1_1TwOHDziwh5OjJizRRK8HuU08Xxd-_JjaLuRqe7A5fTgjnt6TvpIw" 
            />
            <h1 className="font-h1 text-h1 text-text-primary">Bem-vindo de volta</h1>
            <p className="font-body text-body text-text-secondary">Entre com seu e-mail e senha para acessar o painel</p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-status-error-bg text-status-error-text p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form 
            className="flex flex-col gap-md mt-sm" 
            onSubmit={handleSubmit}
          >
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-text-primary" htmlFor="email">E-mail</label>
              <div className="relative flex items-center bg-surface-container-highest rounded-lg focus-within:ring-2 focus-within:ring-primary transition-all">
                <span className="material-symbols-outlined absolute left-sm text-text-secondary">mail</span>
                <input 
                  className="w-full h-11 bg-transparent pl-10 pr-sm rounded-lg font-body text-body text-text-primary placeholder-text-secondary outline-none" 
                  id="email" 
                  placeholder="seu@email.com" 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-text-primary" htmlFor="password">Senha</label>
              <div className="relative flex items-center bg-surface-container-highest rounded-lg focus-within:ring-2 focus-within:ring-primary transition-all">
                <span className="material-symbols-outlined absolute left-sm text-text-secondary">lock</span>
                <input 
                  className="w-full h-11 bg-transparent pl-10 pr-10 rounded-lg font-body text-body text-text-primary placeholder-text-secondary outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="absolute right-sm flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-dim transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-text-secondary text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Options */}
            <div className="flex items-center justify-between mt-xs">
              <label className="flex items-center gap-xs cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 bg-surface-container-highest rounded group-hover:bg-surface-dim transition-colors">
                  <input className="peer sr-only" type="checkbox" />
                  <span 
                    className="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
                <span className="font-small text-small text-text-secondary">Lembrar de mim</span>
              </label>
              <a className="font-small text-small text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded" href="#">Esqueci minha senha</a>
            </div>
            
            {/* Submit Button */}
            <button 
              className="h-11 w-full bg-primary text-on-primary font-h3 text-h3 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center mt-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          {/* Footer Link */}
          <div className="text-center mt-xs">
            <span className="font-small text-small text-text-secondary">Não tem uma conta?</span>
            <Link className="font-small text-small text-primary font-medium ml-1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded" to="/cadastro">
              Cadastre-se
            </Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 pointer-events-none"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-secondary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 pointer-events-none"></div>
      </div>
    </main>
  );
}
