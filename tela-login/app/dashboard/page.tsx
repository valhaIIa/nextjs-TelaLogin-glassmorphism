'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, User, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    // 1. Verificar se o token existe no LocalStorage
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login'); // Redireciona se não houver token
      return;
    }

    try {
      // 2. Decodificar o JWT "na mão" (Payload é a segunda parte do token)
      // Isso evita instalar libs extras só para ler o token no front
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (error) {
      console.error("Token inválido");
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Evita "piscar" a tela enquanto verifica o token
  if (!user) return null; 

  return (
    <div className="min-h-screen w-full bg-black text-white p-8 overflow-hidden relative">
      
      {/* Background Sutil (Diferente do Login para dar sensação de progresso) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Cabeçalho com Animação */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-12 border-b border-white/10 pb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30 text-blue-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Painel do Sistema</h1>
              <p className="text-sm text-gray-400">Bem-vindo de volta</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </motion.header>

        {/* Conteúdo Principal (Grid de Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card de Perfil */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-blue-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20">
                Ativo
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Usuário Logado</h3>
            <p className="text-xl font-bold text-white truncate">{user.email}</p>
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">Role: {user.role}</span>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded">JWT Auth</span>
            </div>
          </motion.div>

          {/* Card Genérico para preencher espaço */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-center items-center text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Área Restrita</h3>
            <p className="text-gray-400 text-sm max-w-[250px]">
              Este conteúdo só é visível porque você possui um token JWT válido armazenado.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}