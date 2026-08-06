import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao realizar cadastro');
      }

      // Registration success, redirect to dashboard or home
      navigate('/dashboard'); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col min-h-screen bg-background">
      <div className="flex flex-col w-full px-margin-mobile pb-xl min-h-[calc(100vh-64px)] justify-center">
        <div className="flex justify-center mb-lg pt-lg">
          <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              alt="Civic Connect Logo" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida/AP1WRLtuJp2sMdpduJgxnMgpvTjqE4Lf7o0VG1U6W3ZMuBTkkjQjYLMUMfNsDIAuCmtR5-_tFjbYBoijfOB8Ygj0wh2uVbh-RPgRY7nm13_FX4wavGXGHzWmgSEr4EYNibYhc9NOn56AtJIuZ-axC8QNCQHybcO3qaXuc76fX_bAlZJ3HZ79OMjRJIvgI8ktIDYdu1RI1_1TwOHDziwh5OjJizRRK8HuU08Xxd-_JjaLuRqe7A5fTgjnt6TvpIw" 
            />
          </div>
        </div>
        
        <div className="text-center mb-xl">
          <h1 className="font-h1 text-h1 text-text-primary mb-xs">Crie sua conta</h1>
          <p className="font-body text-body text-text-secondary">Preencha os dados abaixo para começar a usar o Civic Connect</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative max-w-md mx-auto w-full">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
          
          <form 
            className="p-md flex flex-col gap-md"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="bg-status-error-bg text-status-error-text p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Fullname Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-on-surface-variant ml-1" htmlFor="fullname">Nome completo</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-sm text-outline">person</span>
                <input 
                  className="w-full h-11 pl-10 pr-sm rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-body text-body" 
                  id="fullname" 
                  placeholder="Seu nome completo" 
                  required
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Email Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-on-surface-variant ml-1" htmlFor="email">E-mail</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-sm text-outline">mail</span>
                <input 
                  className="w-full h-11 pl-10 pr-sm rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-body text-body" 
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
              <label className="font-label text-label text-on-surface-variant ml-1" htmlFor="password">Senha</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-sm text-outline">lock</span>
                <input 
                  className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-body text-body" 
                  id="password" 
                  placeholder="••••••••" 
                  required
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="absolute right-sm w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface transition-colors" 
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Confirm Password Input */}
            <div className="flex flex-col gap-xs">
              <label className="font-label text-label text-on-surface-variant ml-1" htmlFor="confirm-password">Confirmar senha</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-sm text-outline">lock</span>
                <input 
                  className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface transition-all font-body text-body" 
                  id="confirm-password" 
                  placeholder="••••••••" 
                  required
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  className="absolute right-sm w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface transition-colors" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  type="button"
                  disabled={loading}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start gap-sm mt-xs">
              <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                <input 
                  className="peer appearance-none w-5 h-5 rounded-[4px] bg-surface-container-high checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container-lowest transition-all cursor-pointer" 
                  id="terms" 
                  required
                  type="checkbox" 
                  disabled={loading}
                />
                <span 
                  className="material-symbols-outlined absolute text-[16px] text-on-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <label className="font-small text-small text-text-secondary cursor-pointer leading-tight" htmlFor="terms">
                Eu concordo com os <a className="text-primary hover:underline" href="#">Termos de Uso</a> e <a className="text-primary hover:underline" href="#">Política de Privacidade</a>
              </label>
            </div>
            
            {/* Submit Button */}
            <button 
              className="w-full h-11 bg-primary text-on-primary rounded-lg font-h3 text-h3 flex items-center justify-center gap-xs mt-sm hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </div>
        
        {/* Footer Link */}
        <div className="mt-lg text-center pb-lg">
          <Link className="font-body text-body text-text-secondary inline-flex items-center gap-xs hover:text-primary transition-colors group" to="/login">
            Já tem uma conta? <span className="font-h3 text-primary group-hover:underline">Entre agora</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
