'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Por favor, insira um email válido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<LoginForm>({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState<Partial<LoginForm>>({});
    const [generalError, setGeneralError] = useState('');


    const router = useRouter();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name as keyof LoginForm]) {
            setFormErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError('');
        setFormErrors({});

        const result = loginSchema.safeParse(formData);


        if (!result.success) {
            // Se falhar, formata os erros do Zod para exibir nos campos corretos
            const formattedErrors: Partial<LoginForm> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginForm;
                formattedErrors[field] = issue.message;
            });
            setFormErrors(formattedErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                localStorage.setItem('token', data.token);
                alert(`Login Realizado! Token: ${data.token.slice(0, 10)}...`);
                router.push('/dashboard'); 
            } else {
                setGeneralError(data.message || 'Credenciais inválidas');
            }
        } catch (error) {
            setGeneralError('Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"
            />

            {/* Card de Login com Efeito Glass */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Bem-vindo
                    </h1>
                    <p className="text-gray-400 text-sm">Acesse seu painel exclusivo</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">

                    {/* Input Email */}
                    <div>
            <div className={`relative group ${formErrors.email ? 'text-red-400' : ''}`}>
              <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${formErrors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'}`} size={20} />
              <input
                name="email"
                type="email"
                placeholder="Seu Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-black/20 border rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all
                  ${formErrors.email 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-white/10 focus:ring-blue-500/50 focus:border-blue-500'
                  }`}
              />
            </div>
            {/* Mensagem de erro do Zod com animação */}
            <AnimatePresence>
              {formErrors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} /> {formErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
                    {/* Input Password */}
                    <div>
            <div className={`relative group ${formErrors.password ? 'text-red-400' : ''}`}>
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${formErrors.password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-purple-400'}`} size={20} />
              <input
                name="password"
                type="password"
                placeholder="Sua Senha"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-black/20 border rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all
                  ${formErrors.password 
                    ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500'
                  }`}
              />
            </div>
            <AnimatePresence>
              {formErrors.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1"
                >
                  <AlertCircle size={12} /> {formErrors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

                    {/* Mensagem de Erro */}
                    <AnimatePresence>
            {generalError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center"
              >
                {generalError}
              </motion.div>
            )}
          </AnimatePresence>

                    {/* Botão com Animação de Hover */}
                    <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Entrar <ArrowRight size={20} />
              </>
            )}
          </motion.button>

        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Não tem uma conta? <span className="text-blue-400 cursor-pointer hover:underline">Solicite acesso</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}